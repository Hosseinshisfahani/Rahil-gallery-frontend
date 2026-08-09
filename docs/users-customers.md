# Rahil Gallery — Users & Customers Module

> **Status:** Implemented in admin UI (v1) with example external API. Production backend integration pending.  
> **Related docs:** [api-assumptions.md](./api-assumptions.md) · [business-logic.md](./business-logic.md) · [pages.md](./pages.md)

---

## 1. Overview

The **Users & Customers** domain covers two distinct concepts:

| Concept | Audience | Admin route | Purpose |
|---------|----------|-------------|---------|
| **Customers** | Shoppers (OTP-auth) | `/admin/customers` | CRM, support, segmentation, lifecycle management |
| **Staff users** | Admin, fulfillment, content | `/admin/users` *(planned — AD-17)* | Internal roles & permissions |

This document focuses on **Customer management**, which is fully implemented in the admin UI. **Staff user management** (`/admin/users`) is specified in [pages.md](./pages.md) (AD-17) but not yet built.

### System context

- **Market:** Iran-only, luxury jewelry e-commerce
- **Auth:** OTP via phone number (storefront); staff JWT for admin API
- **Data pattern:** Read-heavy customer profiles; writes limited to role-based admin actions
- **Architecture:** Next.js admin UI → `lib/api/customers/*` client → external REST API

---

## 2. Admin roles & permissions

### 2.1 Role hierarchy (target)

| Role | Scope |
|------|-------|
| **Admin** | Full access — create, edit, delete, block, export |
| **Customer support** | View profiles, orders; restricted block reason codes |
| **CRM / Growth** | Segmentation, tags, VIP assignment, export |

Current v1 UI does not yet enforce role-based visibility; the backend must enforce permissions per the matrix below when the production API is connected. See [business-logic.md §8.2](./business-logic.md#82-permission-matrix) for the broader admin permission model.

### 2.2 Customer capability matrix

| Capability | Admin | Support | CRM |
|------------|:-----:|:-------:|:---:|
| View customer list | ✓ | ✓ | ✓ |
| View full profile | ✓ | ✓ | ✓ |
| View orders per customer | ✓ | ✓ | ✓ |
| Quick add customer | ✓ | | ✓ |
| History-included import | ✓ | | ✓ |
| Edit customer metadata | ✓ | | ✓ |
| Assign VIP status | ✓ | | ✓ |
| Add / remove tags | ✓ | | ✓ |
| Block / unblock user | ✓ | ✓ (restricted) | |
| View wishlist | ✓ | ✓ | ✓ |
| View LTV | ✓ | ✓ | ✓ |
| Export customer data | ✓ | | ✓ |
| Delete user account | ✓ | | | |

---

## 3. Routes & navigation

| Route | Description |
|-------|-------------|
| `/admin/customers` | Paginated customer list with search, filters, export, add customer |
| `/admin/customers/[id]` | Customer profile — overview, orders, wishlist, notes, audit log |

Sidebar link: **Customers** in `AdminShell` → `/admin/customers`.

---

## 4. Customer list

### 4.1 Table columns

| Column | Description |
|--------|-------------|
| User ID | Internal ID (e.g. `usr-001`) |
| Name | Full name; VIP badge when applicable |
| Phone | Primary identifier (LTR display) |
| Registered | Account creation date |
| Last activity | Most recent engagement |
| Orders | Total order count |
| LTV | Lifetime value (Toman) |
| Segment | New / Active / Returning / VIP / Inactive |
| Status | Active or Blocked |
| Actions | View, Delete |

### 4.2 Quick search

Search applies to:

- **Phone number** (primary — whitespace ignored)
- **Full name**
- **User ID**

Search is debounced (300 ms) and sent to the API as the `q` query parameter.

### 4.3 Advanced search

Expand **Advanced search** on the list page for:

| Filter | Parameter |
|--------|-----------|
| Registration date range | `registeredFrom`, `registeredTo` |
| Last purchase date range | `lastPurchaseFrom`, `lastPurchaseTo` |
| Last activity date range | `lastActivityFrom`, `lastActivityTo` |
| LTV range (Toman) | `ltvMin`, `ltvMax` |
| Order count range | `ordersMin`, `ordersMax` |
| Segment | `segment` |
| Status | `status` |
| VIP only | `vip=true` |
| Purchase history | `hasPurchased` (`yes` / `no`) |
| Customer tags | `tags` (comma-separated) |

Active filters appear as removable chips. **Clear filters** resets filters but keeps the search query; **Clear all** resets everything.

### 4.4 Pagination

- Server-side pagination via API (`page`, `perPage`)
- Default page size: **10**; options: 5, 10, 25, 50
- Footer shows “Showing X–Y of Z customers”

### 4.5 Export

**Export CSV** downloads all records matching current filters (fetches all pages client-side). Includes: ID, name, phone, dates, orders, LTV, segment, status, VIP, tags, last purchase.

### 4.6 Saved segments (preview)

Static preview segments on the list page (LTV high, cart abandoners, ring browsers, bridal intent). Backend-driven dynamic segments are planned; see [§10 Segmentation](#10-segmentation).

---

## 5. Manual customer import

Admins can add customers manually via **Add customer**, with two modes:

### 5.1 Quick add

Minimal fields for fast entry:

| Field | Required |
|-------|----------|
| Full name | ✓ |
| Phone | ✓ |
| Email | |
| Preferred language (fa / en) | |
| Default ring size | |
| VIP checkbox | |

Creates an account with `importMode: "quick"`. Customer can sign in via OTP on first visit.

### 5.2 History included

Full CRM profile for gallery walk-ins, tour groups, and legacy customer migration.

#### Section 1 — Identity data

| Field | Required |
|-------|----------|
| First name | ✓ |
| Last name | ✓ |
| Job | |
| Phone number | ✓ |
| Email | |
| Address | |

#### Section 2 — Important dates

| Field | Description |
|-------|-------------|
| Birthday | Date of birth |
| Marriage date | Wedding / anniversary reference |
| Important date | Custom milestone (e.g. engagement) |
| First entering & visiting date | First gallery visit; also used as registration date |

#### Section 3 — Customer classification

**Customer type** (single select — required):

1. Foreign Customer and Tour Guidances
2. VIP
3. Public
4. Colleagues
5. Family & Friends

**Customer age range** (optional):

- 1–7 · 7–14 · 14–21 · 21–40 · +40

**Purchased categories** (multi-select):

- Gold and Stones
- Silver and Stones
- Stones and Roughs
- Gold and Gemstones
- Silver and Gemstones
- Gemstones and Special Roughs

Selecting **VIP** as customer type automatically assigns VIP status.

#### Section 4 — Experience & signature

| Field | Description |
|-------|-------------|
| Description | Visit notes, preferences, special handling |
| Signature | Text reference for signed visit forms *(image upload via media API — future)* |

Stored as `importMode: "history_included"` with full payload in `importProfile`.

---

## 6. Customer profile

### 6.1 Layout

Profile page (`/admin/customers/[id]`) uses a tabbed layout:

| Tab | Content |
|-----|---------|
| **Overview** | Identity, imported CRM profile (if any), lifecycle, behavioral insights |
| **Orders** | Order history with status badges and return flags |
| **Wishlist** | Saved products and custom configurations |
| **Notes** | Internal CRM notes (staff only) |
| **Audit log** | Sensitive admin actions on this account |

Sidebar **Account actions** panel: edit, block/unblock, VIP, tags, add note, delete.

### 6.2 Identity section

Standard account fields: name, phone, email, user ID, registration date, language, ring size, country (Iran), status badges.

### 6.3 Imported CRM profile section

Shown only when `importMode === "history_included"`. Displays all fields from [§5.2](#52-history-included) in read-only grouped sections.

### 6.4 Lifecycle summary

LTV, total orders, AOV, first/last purchase, VIP status, segment, repeat purchase rate, purchase frequency.

### 6.5 Behavioral insights

Engagement score, top purchased categories, wishlist activity, cart abandonments, configurator usage, funnel position.

---

## 7. Admin actions

All sensitive actions require confirmation modals where noted. Actions call the API and append entries to the **audit log**.

| Action | Who | Notes |
|--------|-----|-------|
| **Edit profile** | Admin, CRM | Quick form or full history form depending on import mode |
| **Delete account** | Admin only | Must type user ID to confirm; redirects to list |
| **Block** | Admin, Support | Requires reason code + optional note |
| **Unblock** | Admin only | Requires justification note |
| **Assign / remove VIP** | Admin, CRM | Toggle; logged in audit trail |
| **Add / remove tag** | Admin, CRM | Multi-assignable operational tags |
| **Add internal note** | Admin, Support, CRM | Timestamped; staff-only |
| **Export** | Admin, CRM | From list page; logged when API enforces |

### 7.1 Block reason codes

| Code | Label |
|------|-------|
| `fraud_suspicion` | Fraud suspicion |
| `payment_issues` | Payment issues |
| `return_abuse` | Abuse of return policy |
| `system_misuse` | System misuse |

### 7.2 Operational tags

VIP · Bridal customer · High spender · At-risk · Influencer lead

Distinct from **customer type** in history import (gallery classification).

### 7.3 Blocked user effects (target)

When connected to production auth:

- Cannot log in
- Cannot checkout
- Wishlist and cart disabled

---

## 8. API integration

### 8.1 Client layer

```
app/admin/customers/*              ← thin route pages
app/admin/_components/customers/   ← UI, hooks, filters
lib/api/customers/
  customers.ts    ← list/get/mutations, params, signature
  types.ts        ← request/response TypeScript types
  index.ts        ← public barrel
lib/api/client.ts ← fetch wrapper, error handling
lib/api/config.ts ← base URL resolution
```

### 8.2 Environment switch

| Mode | Configuration | Base path |
|------|---------------|-----------|
| **Example API** (default) | Leave `NEXT_PUBLIC_API_BASE_URL` unset | `/api/admin/customers` |
| **Production server** | `NEXT_PUBLIC_API_BASE_URL=https://api.rahil.gallery/v1` | `{base}/admin/customers` |

No UI changes required when switching — only the env variable.

See [.env.example](../.env.example) for the template.

### 8.3 Example API routes (development)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/admin/customers` | Paginated list + filters |
| `POST` | `/api/admin/customers` | Create (quick or history) |
| `GET` | `/api/admin/customers/:id` | Full profile |
| `PATCH` | `/api/admin/customers/:id` | Update profile / importProfile |
| `DELETE` | `/api/admin/customers/:id` | Delete account |
| `POST` | `/api/admin/customers/:id/block` | Block account |
| `POST` | `/api/admin/customers/:id/unblock` | Unblock account |
| `POST` | `/api/admin/customers/:id/vip` | Toggle VIP |
| `POST` | `/api/admin/customers/:id/tags` | Toggle tag |
| `POST` | `/api/admin/customers/:id/notes` | Add CRM note |

Example API uses an in-memory store (`lib/api/customers/example-store.ts`) seeded from mock data. Data persists for the dev server session only.

Full request/response contracts: [api-assumptions.md § Admin Customers](./api-assumptions.md#admin-customers).

### 8.4 Pagination response

```json
{
  "data": [/* CustomerSummary[] */],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 30,
    "totalPages": 3
  }
}
```

### 8.5 Create customer — quick add

```json
{
  "importMode": "quick",
  "fullName": "Sara Mohammadi",
  "phone": "+989121234567",
  "email": "sara@example.com",
  "locale": "fa",
  "defaultRingSize": "14",
  "isVip": false
}
```

### 8.6 Create customer — history included

```json
{
  "importMode": "history_included",
  "importProfile": {
    "firstName": "Sara",
    "lastName": "Mohammadi",
    "job": "Architect",
    "phone": "+989121234567",
    "email": "sara@example.com",
    "address": "Tehran, Vanak",
    "birthday": "1990-05-12",
    "marriageDate": "2018-03-20",
    "importantDate": "2024-11-01",
    "firstVisitDate": "2024-10-15",
    "customerType": "vip",
    "customerAgeRange": "21-40",
    "purchasedCategories": ["gold_and_gemstones", "silver_and_stones"],
    "description": "Visited for bridal consultation",
    "signature": "S. Mohammadi"
  }
}
```

---

## 9. Data model

### 9.1 CustomerSummary (list)

Core fields returned in paginated list: `id`, `fullName`, `phone`, `registeredAt`, `lastActivityAt`, `lastPurchaseDate`, `totalOrders`, `totalLtv`, `segment`, `status`, `isVip`, `tags`, `country`, `href`.

### 9.2 CustomerDetail (profile)

Extends summary with: `email`, `locale`, `defaultRingSize`, lifecycle metrics, behavioral insights, `orders`, `wishlist`, `notes`, `auditLog`, and optionally:

| Field | Type | Description |
|-------|------|-------------|
| `importMode` | `"quick"` \| `"history_included"` | How the customer was manually added |
| `importProfile` | `CustomerImportProfile` | Full CRM import payload |

### 9.3 CustomerImportProfile

See [§5.2](#52-history-included) for field list. TypeScript definitions and enum labels live in:

`@/lib/api/customers/types`

### 9.4 Segments (system)

Auto-calculated segments: `new`, `active`, `returning`, `vip`, `inactive`.

---

## 10. Segmentation

### 10.1 System segments

Derived from order history, activity, and VIP status. Filterable on the list page via the segment dropdown.

### 10.2 Saved segments (preview)

UI preview only — counts are static mock data. Production implementation will support:

- Dynamic rules (LTV > X, cart abandoners, category browsers)
- Saved / exported segment lists
- Marketing campaign integration

---

## 11. Related metrics

Customer profiles surface LTV and order history for CRM workflows. Aggregate BI dashboards are out of scope for this module.

---

## 12. Audit logging & compliance

Every sensitive admin action is logged on the customer profile **Audit log** tab:

| Event | Trigger |
|-------|---------|
| Account created (quick / history) | POST customer |
| Profile edited | PATCH customer |
| Account blocked / unblocked | POST block / unblock |
| VIP assigned / removed | POST vip |
| Tag added / removed | POST tags |
| Internal note added | POST notes |
| Data exported | GET export *(when API enforces)* |

Audit entry fields: admin user ID, action type, target user ID, timestamp, reason (if required), details.

---

## 13. Security rules

- Admin routes require authentication + role validation *(backend enforced)*
- No direct database access from frontend
- Sensitive actions use confirmation modals
- Phone numbers treated as sensitive identifiers (LTR display, indexed search on backend)
- Rate-limited exports *(production)*
- Delete requires typing the user ID to confirm

---

## 14. Performance requirements

| Operation | Target |
|-----------|--------|
| Customer search | < 500 ms |
| Profile load | < 1 s (cached aggregates recommended) |
| Segment computation | Backend async job |
| Large exports | Streamed download |

Example API simulates ~200–250 ms latency for realistic loading states.

---

## 15. Frontend file reference

```
app/admin/customers/
  page.tsx                    # List page
  [id]/page.tsx               # Detail page

app/api/admin/customers/      # Example external API
  route.ts
  [id]/route.ts
  [id]/block|unblock|vip|tags|notes/route.ts

app/admin/_components/customers/
  customers-list-view.tsx     # List + filters + pagination
  customer-detail-view.tsx    # Profile tabs + actions
  use-customers-list.ts       # Paginated fetch + filters
  use-customer-detail.ts      # Profile fetch + mutations
  add-customer-flow.tsx       # Quick vs history choice
  customer-history-import-form.tsx
  customer-crud-modals.tsx    # Quick create/edit/delete
  customer-action-modals.tsx  # Block, VIP, tags, notes
  customer-detail-sections.tsx  # Profile section cards
  customers-filters.tsx
  customers-crm-advanced-search.tsx
  customers-table.tsx
  filter-customers.ts
  export-customers.ts
  customer-error.ts
  customer-detail-enabled.ts
  index.ts

lib/api/customers/            # API client
  customers.ts                # list/get/mutations, params, signature
  types.ts
  index.ts
```

---

## 16. Staff users (planned)

**Route:** `/admin/users` (AD-17 in [pages.md](./pages.md))

Staff user management — internal accounts, role assignment, permission matrix editing — is **not yet implemented**. It is distinct from customer CRM:

| | Customers | Staff users |
|---|-----------|-------------|
| Route | `/admin/customers` | `/admin/users` |
| Auth | OTP (storefront) | Staff JWT |
| API | `/admin/customers/*` | `/admin/users/*` |

When built, staff user docs should live in a separate section or `docs/admin-users.md`.

---

## 17. Migration checklist (production backend)

When connecting to the real API:

- [ ] Set `NEXT_PUBLIC_API_BASE_URL` in production env
- [ ] Confirm all endpoints match [api-assumptions.md](./api-assumptions.md)
- [ ] Implement role-based permission enforcement on every route
- [ ] Replace example in-memory store with persistent database
- [ ] Add phone index for sub-500 ms search
- [ ] Wire signature field to media upload API
- [ ] Implement dynamic saved segments API
- [ ] Add export rate limiting and audit logging on server
- [ ] Generate TypeScript types from OpenAPI spec
- [ ] Implement staff users module (`/admin/users`)

---

## 18. Open decisions

| Topic | Status |
|-------|--------|
| Signature image upload | Text reference only in v1; media API TBD |
| Saved segments backend | UI preview with mock counts |
| Role-based UI hiding | Deferred until auth middleware lands |
| Guest / walk-in without phone | History import requires phone |
| Customer merge / dedup | Not in v1 |

---

*Last updated: June 2026 — reflects implemented admin customer module through history-included import and example API layer.*
