# Rahil Gallery — Figma UI Briefs

> **Task 3 deliverable.** Figma-ready specifications for you to implement visually.  
> **Direction:** Modern bold — strong typography, high contrast, contemporary luxury.  
> **You own:** Colors, fonts, imagery, micro-interactions, final pixel polish.

---

## How to Use This Document

For each page:
1. Create a Figma frame at the listed **frame size**
2. Apply the **grid** and **spacing tokens**
3. Place **content blocks** in section order (top → bottom)
4. Design **component states** listed
5. Duplicate frame for **breakpoints** and adjust layout notes

---

## Global Design System Brief

The codebase implements **two visual surfaces** — design them as related but distinct systems in Figma:

| Surface | Audience | Mood | Implemented tokens (code) |
|---------|----------|------|---------------------------|
| **Store** | Customers | Modern bold luxury — high contrast, editorial type | Gold accent `#C9A962`, ink/canvas, Playfair display |
| **Dashboard** | Staff / admin | Modern operational — clean, dense, SaaS-like | Indigo primary `#6366F1`, zinc grays, dark sidebar `#09090B` |

Store and account pages share the **store** surface. Admin routes use **dashboard** only.

### Design Tokens (Define in Figma Variables)

#### Store surface

| Token category | Guidance |
|----------------|----------|
| **Typography** | Bold display serif (Playfair) for headlines; Geist/Vazirmatn for body. Headlines: 48–72px desktop hero, 32–40px page titles. Body: 16–18px. Strong weight contrast (700 headlines / 400 body). |
| **Color** | High contrast: near-black ink + warm canvas base. Gold accent for CTAs. Avoid soft pastels. |
| **Spacing scale** | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| **Radius** | Minimal: 0–4px (sharp luxury) or 8px max for cards |
| **Elevation** | Flat or single subtle shadow — no heavy material shadows |
| **Icons** | Stroke icons, 1.5–2px, 24px default |
| **Imagery** | Full-bleed photography, high contrast, generous crop |

#### Dashboard surface

| Token category | Guidance |
|----------------|----------|
| **Typography** | Geist sans (Vazirmatn for FA) throughout — no serif. Page titles 20–24px, table body 14px, labels 12px. Tighter tracking on headings. |
| **Color** | Canvas `#F4F4F5`, cards white, text zinc-900/600. Primary indigo `#6366F1`. Sidebar near-black with muted zinc links; active item indigo fill. |
| **Spacing** | Denser than store — 16–24px card padding, 24px page gutters |
| **Radius** | 6–12px on cards, nav items, inputs |
| **Elevation** | Light shadow on cards; hover lift on stat cards |
| **Controls** | Compact heights (~36px default button/input) |

### Layout Grid

| Breakpoint | Frame width | Columns | Gutter | Margin |
|------------|-------------|---------|--------|--------|
| Desktop | 1440px | 12 | 24px | 80px |
| Tablet | 768px | 8 | 16px | 32px |
| Mobile | 375px | 4 | 16px | 16px |

### Shared Components (Build as Figma Components)

Create a **Design System** page in Figma with two sub-pages: **Store** and **Dashboard**.

**Store components:**
- Buttons: Primary (filled), Secondary (outline), Ghost, Disabled
- Inputs: Text, Phone, OTP (6 boxes), Select, Textarea
- Card, FormField, EmptyState, SectionTitle
- ProductCard: Default, Hover
- StatusBadge: in_stock, made_to_order, order statuses
- SiteHeader: Desktop, Mobile collapsed
- SiteFooter: Full
- PriceDisplay: FA and EN variants

**Dashboard components:**
- Same button/input primitives (compact sizing)
- DashboardCard, StatCard (with trend accent bar)
- AdminSidebar (dark), AdminTopBar (frosted)
- DataTable row states (default, hover)
- StatusBadge (reuse store variant — colors adapt via tokens)

### RTL Note

Duplicate key frames as **FA-RTL** variants: mirror horizontal layout, keep prices LTR.

---

## Storefront Pages

### F-S01 Homepage

**Frame:** `1440 × auto` (min ~3200px height) · **Page:** S-01

#### Section order

| # | Block | Height guidance | Content |
|---|-------|-----------------|---------|
| 1 | SiteHeader | 72px fixed | Logo left, nav center, icons right (search, wishlist, account, cart) |
| 2 | Hero | 90vh max | Full-width image/video, bold headline 2 lines, single CTA "Explore Collection" |
| 3 | Featured collections | ~600px | Section title + 3 equal cards, image-dominant, collection name overlay |
| 4 | New arrivals | ~800px | Title left, "View all" link right; 4×2 product grid |
| 5 | Editorial | ~500px | Split 50/50: large image | bold quote + link to Craft |
| 6 | Journal teaser | ~500px | 3 blog cards horizontal |
| 7 | SiteFooter | ~400px | 4-column links + legal |

#### Component states

- Hero CTA: default, hover
- ProductCard: default, hover (subtle image scale)
- CollectionCard: default, hover

#### Responsive notes

- **Tablet:** Hero 70vh; collections 2+1 grid; products 2 columns
- **Mobile:** Stack all; hero 100vh; horizontal scroll for collections optional

---

### F-S02 / S-03 Product Listing (PLP)

**Frame:** `1440 × auto` · **Pages:** Shop, Category

#### Section order

| # | Block | Content |
|---|-------|---------|
| 1 | SiteHeader | Standard |
| 2 | Page header | H1 category name + result count subtitle |
| 3 | Toolbar | Filter chips row + sort dropdown right |
| 4 | Main layout | Sidebar 280px filters \| Product grid fills rest |
| 5 | Product grid | 3 columns desktop, ProductCard repeat |
| 6 | Pagination | Centered |
| 7 | SiteFooter | Standard |

#### Filter panel blocks

- Category (checkbox tree)
- Metal (swatches)
- Stone type (checkboxes)
- Price range (dual slider)
- Availability (radio)

#### Component states

- Filter chip: active, removable
- Mobile: filter drawer full-screen overlay

#### Responsive

- **Tablet:** 2-column grid; filters in drawer
- **Mobile:** 2-column grid; filter FAB bottom-right

---

### F-S04 Collection Page

**Frame:** `1440 × auto`

#### Section order

| # | Block | Content |
|---|-------|---------|
| 1 | SiteHeader | |
| 2 | Collection hero | Full-width 60vh image + title overlay bottom-left |
| 3 | Description | Max-width 720px centered text |
| 4 | Product grid | Same as PLP |
| 5 | SiteFooter | |

---

### F-S05 Product Detail (PDP)

**Frame:** `1440 × auto` · **Critical page for MVP**

#### Section order

| # | Block | Layout |
|---|-------|--------|
| 1 | SiteHeader | |
| 2 | Breadcrumbs | |
| 3 | Product main | 55% gallery left \| 45% info right |
| 4 | Gallery | Main image 1:1 + thumbnail strip vertical or horizontal |
| 5 | Product info | Title, price, availability badge, rating, variant selectors, CTAs stack |
| 6 | Description tabs | Details \| Materials \| Care |
| 7 | Reviews | Summary bar + review cards list |
| 8 | Related products | Horizontal scroll or 4-column grid |
| 9 | SiteFooter | |

#### CTA hierarchy

1. **Primary:** Add to Cart (full width)
2. **Secondary:** Customize (outline, if configurable)
3. **Tertiary:** Wishlist (icon + label)

#### Component states

- MetalSwatch: selected, unselected, disabled
- Add to Cart: default, loading, disabled (out of stock)
- Gallery: selected thumbnail border

#### Responsive

- **Mobile:** Gallery carousel full width; info below; sticky bottom bar with price + Add to Cart

---

### F-S06 Configurator

**Frame:** `1440 × 900` min · **Complex interactive page**

#### Section order

| # | Block | Layout |
|---|-------|--------|
| 1 | SiteHeader | Minimal (logo + exit link) |
| 2 | Step indicator | Horizontal steps: Metal → Stone → Size → Finish → Review |
| 3 | Main split | 50% preview \| 50% options panel |
| 4 | Preview | Large product render on neutral background |
| 5 | Options | One OptionGroup visible per step OR scroll all groups |
| 6 | Sticky summary bar | Bottom: price, lead time, Add to Cart, Save |

#### Component states

- Step: complete, active, upcoming
- Option button: default, selected, disabled + tooltip
- Summary: price updating (loading skeleton)

#### Responsive

- **Mobile:** Preview top 40vh; options scroll; sticky summary bottom

---

### F-S07 Search Results

Same frame as PLP with search query in page header: `Results for "diamond ring"` + optional highlight.

---

### F-S08 Blog Index

**Frame:** `1440 × auto`

| # | Block |
|---|-------|
| 1 | SiteHeader |
| 2 | Page title "Journal" |
| 3 | Tag filter pills |
| 4 | Blog grid 3 columns — BlogCard (image 16:9, title, date, excerpt) |
| 5 | Pagination |
| 6 | SiteFooter |

---

### F-S09 Blog Post

**Frame:** `1440 × auto` · **Content width max 720px for article**

| # | Block |
|---|-------|
| 1 | SiteHeader |
| 2 | Hero image full bleed or contained |
| 3 | Title + date |
| 4 | Rich text body |
| 5 | Related posts 3 cards |
| 6 | SiteFooter |

---

### F-S10 About · F-S11 Craft · F-S14 Legal

**Template frame:** `1440 × auto`

| # | Block |
|---|-------|
| 1 | SiteHeader |
| 2 | Page hero — bold H1, optional subline |
| 3 | Content sections — alternate text / full-width image |
| 4 | SiteFooter |

**Craft page:** Add process timeline (4 steps with icons).

**Legal:** Single column prose, max-width 800px.

---

### F-S12 Contact

| # | Block |
|---|-------|
| 1–2 | Header + hero |
| 3 | Split: ContactForm left \| Map + address right |
| 4 | SiteFooter |

---

### F-S13 Size Guide

| # | Block |
|---|-------|
| 1–2 | Header + hero |
| 3 | Size chart table (ring sizes IR/EU/US) |
| 4 | How to measure — illustration + steps |
| 5 | SiteFooter |

---

## Auth Pages

### F-A01 Login / Register

**Frame:** `1440 × 900` · Centered card **480px wide**

#### Card content blocks

| Step | Content |
|------|---------|
| 1 | Logo, "Sign in with phone", PhoneInput, Continue button |
| 2 | "Enter code sent to +98...", OtpInput 6 boxes, Resend (60s countdown), Verify |

#### States

- OTP error shake + message
- Loading on submit

#### Responsive

- Mobile: card full width minus 32px margin

---

## Account Pages

**Shared layout frame:** `1440 × auto`

```
┌─────────────────────────────────────────┐
│ SiteHeader                              │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Main content area            │
│ 240px    │                              │
└──────────┴──────────────────────────────┘
│ SiteFooter                              │
└─────────────────────────────────────────┘
```

### F-C01 Account Overview

Main: Profile summary card + 3 recent order cards + quick link tiles.

### F-C03 Addresses

Main: Grid of AddressCards + "Add address" dashed card. Modal frame for AddressForm.

### F-C04 Orders List

Main: Table or stacked OrderSummaryCards with status badge, date, total.

### F-C05 Order Detail

Main blocks:
- Order header row
- Timeline stepper (horizontal)
- Line items (read-only CartLineItem)
- Address + tracking card
- Action buttons row

### F-C06 Wishlist

Main: 3-column ProductCard grid with remove icon overlay.

### F-C08 Return Request

Main: Checkbox list of line items → reason dropdown → comment → photo upload zone → submit.

### F-C09 Write Review

Main: Product mini card + star picker + text fields + submit.

---

## Checkout Pages

### F-K01 Cart

**Frame:** `1440 × auto`

| # | Block | Layout |
|---|-------|--------|
| 1 | SiteHeader | |
| 2 | H1 "Cart" | |
| 3 | Main | 65% line items \| 35% OrderSummary sticky |
| 4 | Line item | Image 100px, details, qty stepper, price, remove |
| 5 | Lead time callout | If mixed cart |
| 6 | Summary | Subtotal, shipping estimate, total, Checkout CTA |
| 7 | SiteFooter | |

**Empty state frame:** Illustration + "Browse shop" CTA.

---

### F-K02 Checkout

**Frame:** `1440 × auto` · **Minimal header (logo only)**

| # | Block |
|---|-------|
| 1 | Step indicator: Address → Shipping → Payment |
| 2 | Main 60% | Address cards + add form |
| 3 | Sidebar 40% sticky | OrderSummary + Place Order |
| 4 | Payment gateway | 3 selectable cards with logos |
| 5 | Made-to-order checkbox | Required before pay |

---

### F-K03 Success / F-K04 Failed

**Frame:** `1440 × 600` · Centered result card 560px

**Success:** Check icon, "Thank you", order number, view order + continue shopping.

**Failed:** Error icon, message, retry payment + contact support.

---

## Admin Pages

**Design direction (implemented in code):** Modern operational UI — **light content area** on zinc canvas, **dark sidebar** (240px), **indigo** primary actions. Denser than storefront; Geist sans typography; stat cards with subtle top accent by trend (green / red / indigo).

**Live preview:** `/admin` · **Theme file:** `app/styles/themes/dashboard.css`

### Admin layout template

**Frame:** `1440 × 900`

```
┌────────┬────────────────────────────────────┐
│ Sidebar│ TopBar (title, user avatar)      │
│ 256px  ├────────────────────────────────────┤
│ #09090B│ Page content (max-width ~1280px)   │
│        │ StatCards → Cards / tables         │
└────────┴────────────────────────────────────┘
```

**Sidebar nav items (v1 preview):** Dashboard, Orders, Products, Customers, Content, Settings

### F-AD02 Dashboard

Content blocks: `DashboardSectionTitle` → 4 `StatCard` row → `DashboardCard` with recent orders table → `DashboardCard` with quick actions.

**StatCard states:** default, hover (elevated shadow), trend accents (up / down / neutral)

### F-AD03 Products List

Content: Search bar + "Add product" button → DataTable (image thumb, name, category, status, actions).

### F-AD04 Product Edit

Content: Tabbed or long form — Basic info (bilingual) → Media → Variants → Settings. Sticky save bar bottom.

### F-AD09 Orders List

DataTable: Order #, customer, date, status badge, total, actions.

### F-AD10 Order Detail

Two-column: Left — line items + config expandable JSON. Right — status update form, tracking, notes.

### F-AD11 Returns Queue

DataTable with photo thumbnail preview column.

### F-AD13 Reviews Moderation

Split: pending list left | review preview + approve/reject right.

### F-AD14 Blog / F-AD16 Homepage

Standard admin form layouts with bilingual fields and media upload zones.

### F-AD18 Settings

Tabbed: Shipping | Returns | Payment gateways (toggles) | General.

---

## Figma File Structure (Recommended)

```
📁 Rahil Gallery
├── 🎨 Design System
│   ├── Store (luxury tokens)
│   ├── Dashboard (admin tokens)
│   ├── Typography
│   ├── Spacing
│   └── Components
├── 🏠 Storefront
│   ├── Homepage
│   ├── PLP
│   ├── PDP
│   ├── Configurator
│   ├── Blog
│   └── Static
├── 👤 Account & Auth
├── 🛒 Checkout
├── ⚙️ Admin
└── 📱 Responsive / RTL Variants
```

---

## Page Checklist

Use this when designing in Figma:

| Page | Desktop | Tablet | Mobile | RTL |
|------|:-------:|:------:|:------:|:---:|
| Homepage | ☐ | ☐ | ☐ | ☐ |
| PLP | ☐ | ☐ | ☐ | ☐ |
| PDP | ☐ | ☐ | ☐ | ☐ |
| Configurator | ☐ | ☐ | ☐ | ☐ |
| Collection | ☐ | ☐ | ☐ | ☐ |
| Blog index | ☐ | ☐ | ☐ | ☐ |
| Blog post | ☐ | ☐ | ☐ | ☐ |
| Login | ☐ | ☐ | ☐ | ☐ |
| Cart | ☐ | ☐ | ☐ | ☐ |
| Checkout | ☐ | ☐ | ☐ | ☐ |
| Payment result | ☐ | ☐ | ☐ | ☐ |
| Account overview | ☐ | ☐ | ☐ | ☐ |
| Order detail | ☐ | ☐ | ☐ | ☐ |
| Wishlist | ☐ | ☐ | ☐ | ☐ |
| Return request | ☐ | ☐ | ☐ | ☐ |
| About / Craft / Contact | ☐ | ☐ | ☐ | ☐ |
| Admin dashboard | ☐ | ☐ | — | — |
| Admin product edit | ☐ | ☐ | — | — |
| Admin order detail | ☐ | ☐ | — | — |

---

## Content Placeholders

Use realistic luxury jewelry placeholder copy in designs:

- Product: "Solitaire Diamond Ring", "Emerald Pendant Necklace"
- Price: `۱۲۵٬۰۰۰٬۰۰۰ تومان` / `125,000,000 Toman`
- Lead time: "Crafted in 4–6 weeks"
- Hero headline: "Bold Forms. Enduring Craft."

---

*Reference: [business-logic.md](./business-logic.md) · [pages.md](./pages.md) · [components.md](./components.md) — see **Component Architecture** for `core/` + `surfaces/` folder layout and theme tokens.*
