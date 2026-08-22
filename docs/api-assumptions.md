# Rahil Gallery — API Integration Assumptions

> **Status:** Live contracts for Go + Django Strangler Fig.  
> **Browser base:** `/api/v1` (Next.js rewrites)  
> **Go:** auth, admin customers, catalog (`GO_API_PROXY_URL`, default `:8081`)  
> **Django:** carts, orders, payments, promotions (`DJANGO_API_PROXY_URL`, default `:8000`)  
> **Auth:** Bearer JWT issued by Go; Django verifies the same `JWT_ACCESS_SECRET`.

### Response envelope (both backends)

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "error": { "code": "unauthorized", "message": "..." } }
```

### Cart (Django)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/v1/carts/me` | Get or create active cart |
| POST | `/api/v1/carts/me/items` | `{ variant_id, quantity, unit_price_snapshot }` |
| PATCH | `/api/v1/carts/me/items/:id` | `{ quantity }` |
| DELETE | `/api/v1/carts/me/items/:id` | Remove line |

---

## Conventions

### Request headers

```
Accept-Language: fa | en
Authorization: Bearer <token>
Content-Type: application/json
```

### Pagination

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 24,
    "total": 142,
    "totalPages": 6
  }
}
```

Query params: `?page=1&perPage=24`

### Error response

```json
{
  "error": {
    "code": "UNAUTHORIZED | VALIDATION_ERROR | NOT_FOUND | RATE_LIMITED | INTERNAL",
    "message": "Localized or English message",
    "details": [{ "field": "phone", "message": "Invalid format" }]
  }
}
```

---

## Auth

### POST `/auth/otp/send`

Request:
```json
{ "phone": "+989123456789" }
```

Response:
```json
{ "expiresIn": 120, "retryAfter": 60 }
```

### POST `/auth/otp/verify`

Request:
```json
{ "phone": "+989123456789", "code": "123456" }
```

Response:
```json
{
  "token": "jwt...",
  "user": {
    "id": "uuid",
    "phone": "+989123456789",
    "name": null,
    "email": null,
    "defaultRingSize": null,
    "locale": "fa",
    "roles": []
  },
  "isNewUser": true
}
```

### POST `/auth/logout`

### GET `/auth/me`

Returns current user profile.

---

## Catalog

### GET `/categories`

Returns category tree with bilingual names and slugs.

### GET `/products`

Query: `category`, `collection`, `metal`, `stone`, `priceMin`, `priceMax`, `availability`, `sort`, `page`, `perPage`, `q`

Response item:
```json
{
  "id": "uuid",
  "slug": "solitaire-diamond-ring",
  "title": { "fa": "...", "en": "..." },
  "category": "rings",
  "priceFrom": 85000000,
  "priceTo": 120000000,
  "images": [{ "url": "...", "alt": "..." }],
  "availability": "in_stock | made_to_order | out_of_stock",
  "isConfigurable": true,
  "averageRating": 4.8,
  "reviewCount": 12
}
```

### GET `/products/:slug`

Full product with variants, attributes, related products, reviews summary.

### GET `/collections`

List editorial collections.

### GET `/collections/:slug`

Collection detail + paginated products.

---

## Configurator

### GET `/configurator/:category/options`

Returns option groups per category (metal, stone, sizes, etc.) with modifiers.

### POST `/configurator/validate`

Request:
```json
{
  "category": "rings",
  "configuration": { "metal": "18k-yellow-gold", "stone": { "type": "diamond" } }
}
```

Response:
```json
{ "valid": true, "errors": [] }
```

### POST `/configurator/price`

Request: same as validate.

Response:
```json
{
  "price": 125000000,
  "leadTimeDays": { "min": 28, "max": 42 },
  "fulfillmentMode": "made_to_order",
  "configurationHash": "abc123"
}
```

---

## Cart

### GET `/cart`

### POST `/cart/items`

Request:
```json
{
  "productId": "uuid",
  "variantId": "uuid | null",
  "quantity": 1,
  "configuration": { },
  "configurationHash": "abc123 | null"
}
```

### PATCH `/cart/items/:id`

### DELETE `/cart/items/:id`

---

## Checkout & Payment

### GET `/addresses`

### POST `/addresses`

Iran domestic fields: `fullName`, `phone`, `province`, `city`, `addressLine`, `postalCode`, `isDefault`

### GET `/shipping/methods`

Query: `addressId`

### POST `/checkout`

Request:
```json
{
  "addressId": "uuid",
  "shippingMethodId": "uuid",
  "gateway": "zarinpal | idpay | zibal"
}
```

Response:
```json
{
  "orderId": "uuid",
  "orderNumber": "RG-2026-001234",
  "status": "pending_payment",
  "paymentUrl": "https://gateway.../pay",
  "expiresAt": "2026-06-02T12:30:00Z"
}
```

### GET `/checkout/callback`

Query: gateway-specific params. Returns payment result for frontend confirmation page.

### GET `/orders/:id/payment-status`

Poll after callback if needed.

---

## Orders (Customer)

### GET `/orders`

### GET `/orders/:id`

Includes status history timeline, line items with configuration snapshots, tracking.

---

## Returns

### POST `/returns`

Request:
```json
{
  "orderId": "uuid",
  "items": [{ "orderLineId": "uuid", "reason": "wrong_size", "comment": "...", "photoUrls": [] }]
}
```

### GET `/returns`

Customer's return requests.

---

## Reviews

### POST `/reviews`

Request:
```json
{
  "orderLineId": "uuid",
  "rating": 5,
  "title": "...",
  "body": "...",
  "photoUrls": []
}
```

### GET `/products/:slug/reviews`

---

## Wishlist

### GET `/wishlist`

Includes saved configurations.

### POST `/wishlist`

Request: `{ "productId", "variantId?", "configuration?", "configurationHash?" }`

### DELETE `/wishlist/:id`

---

## Profile

### PATCH `/profile`

Fields: `name`, `email`, `defaultRingSize`, `locale`

---

## Content

### GET `/blog/posts`

Paginated, filter by tag.

### GET `/blog/posts/:slug`

### GET `/homepage/blocks`

Returns ordered blocks for homepage assembly.

---

## Admin Endpoints

All require staff role. Backend enforces permissions per [business-logic.md](./business-logic.md) matrix.

| Area | Endpoints |
|------|-----------|
| Products | `GET/POST/PATCH/DELETE /admin/products`, variants, inventory |
| Collections | CRUD `/admin/collections` |
| Configurator | CRUD `/admin/configurator/:category/options` |
| Orders | `GET /admin/orders`, `PATCH /admin/orders/:id/status`, tracking |
| Returns | `GET /admin/returns`, `PATCH /admin/returns/:id` |
| Reviews | `GET /admin/reviews`, `PATCH /admin/reviews/:id/moderate` |
| Blog | CRUD `/admin/blog/posts` |
| Homepage | CRUD `/admin/homepage/blocks` |
| Users | CRUD `/admin/users`, roles |
| Customers | `GET /admin/customers`, `GET/PATCH /admin/customers/:id`, tags, VIP, block/unblock, notes, export |
| Settings | `GET/PATCH /admin/settings` (shipping, returns, gateways) |
| Media | `POST /admin/media/upload-url` (presigned) |

### PATCH `/admin/orders/:id/status`

Request:
```json
{
  "status": "shipped",
  "trackingNumber": "1234567890",
  "carrier": "tipax",
  "note": "Internal note"
}
```

### PATCH `/admin/returns/:id`

Request:
```json
{ "action": "approve | reject", "reason": "...", "refundAmount": 125000000 }
```

---

## Admin Customers

Staff roles: Admin (full), Support (view + restricted block), CRM/Growth (tags, VIP, export).

### GET `/admin/customers`

Query: `q` (phone, name, user ID), `segment`, `status`, `vip`, `ltvMin`, `ltvMax`, `ordersMin`, `ordersMax`, `registeredFrom`, `registeredTo`, `lastPurchaseFrom`, `lastActivityFrom`, `lastActivityTo`, `tags`, `hasPurchased`, `page`, `perPage`

Response:
```json
{
  "data": [/* customer items */],
  "meta": { "page": 1, "perPage": 10, "total": 30, "totalPages": 3 }
}
```

**Frontend integration:** Until the production backend is available, the app ships an example external API at `GET /api/admin/customers` (see `app/api/admin/customers/route.ts`). Set `NEXT_PUBLIC_API_BASE_URL` to switch the client to the real server — no UI changes required.

### POST `/admin/customers`

Create admin-provisioned customer account.

Request (quick add):
```json
{
  "importMode": "quick",
  "fullName": "Sara Mohammadi",
  "phone": "+989121234567",
  "email": "optional@example.com",
  "locale": "fa",
  "isVip": false
}
```

Request (history included):
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
    "customerType": "vip | public | foreign_and_tour_guidance | colleagues | family_and_friends",
    "customerAgeRange": "21-40",
    "purchasedCategories": ["gold_and_gemstones", "silver_and_stones"],
    "description": "Visited for bridal consultation",
    "signature": "S. Mohammadi"
  }
}
```

Response: `201` with full customer detail object.

### GET `/admin/customers/:id`

Full profile with lifecycle summary, behavioral insights, orders, wishlist, notes, audit log.

### PATCH `/admin/customers/:id`

Metadata edits (Admin, CRM): `fullName`, `phone`, `email`, `locale`, `defaultRingSize`, `isVip`, `tags`. Logged in audit trail.

### DELETE `/admin/customers/:id`

Admin-only permanent account deletion. Response: `{ "success": true }`.

### POST `/admin/customers/:id/vip`

Toggle VIP status. Returns updated customer.

### POST `/admin/customers/:id/tags`

Request: `{ "tag": "VIP" }` — toggles tag on/off. Returns updated customer.

### POST `/admin/customers/:id/block`

Request:
```json
{
  "reason": "fraud_suspicion | payment_issues | return_abuse | system_misuse",
  "note": "Optional internal note"
}
```

### POST `/admin/customers/:id/unblock`

Request:
```json
{ "justification": "Required admin note" }
```

### POST `/admin/customers/:id/notes`

Request:
```json
{ "body": "Internal CRM note text" }
```

### GET `/admin/customers/export`

Query: same filters as list. Returns streamed CSV or JSON. Rate-limited.

### GET `/admin/customers/segments`

Saved dynamic segments with customer counts.

---

## Webhooks (Backend-only)

Frontend does not consume webhooks. Documented for awareness:

- Payment gateway → backend: payment success/failure
- Backend may push order status to SMS/email — not frontend concern

---

## Migration Checklist

When official API docs arrive:

- [ ] Replace assumed paths with actual routes
- [ ] Confirm auth mechanism (JWT vs cookie)
- [ ] Confirm payment callback URL pattern
- [ ] Map error codes to frontend i18n strings
- [ ] Generate TypeScript types from OpenAPI spec
- [ ] Update [`business-logic.md`](./business-logic.md) Open Decisions Log
