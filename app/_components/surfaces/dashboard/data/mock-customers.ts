import type { OrderStatus } from "@/_components/shared/inclusive/status-badge";

export type CustomerSegment =
  | "new"
  | "active"
  | "returning"
  | "vip"
  | "inactive";

export type CustomerStatus = "active" | "blocked";

export type VipSource = "manual" | "automatic" | null;

export type BlockReasonCode =
  | "fraud_suspicion"
  | "payment_issues"
  | "return_abuse"
  | "system_misuse";

export type AuditActionType =
  | "account_created"
  | "block"
  | "unblock"
  | "vip_assign"
  | "vip_remove"
  | "tag_add"
  | "tag_remove"
  | "profile_edit"
  | "note_add"
  | "export";

export const CUSTOMER_TAGS = [
  "VIP",
  "Bridal customer",
  "High spender",
  "At-risk",
  "Influencer lead",
] as const;

export type CustomerTag = (typeof CUSTOMER_TAGS)[number];

/** Manual import — customer type classification */
export const CUSTOMER_TYPES = [
  "foreign_and_tour_guidance",
  "vip",
  "public",
  "colleagues",
  "family_and_friends",
] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  foreign_and_tour_guidance: "Foreign Customer and Tour Guidance",
  vip: "Internal VIP",
  public: "Public Customers",
  colleagues: "Colleagues",
  family_and_friends: "Friends and Family",
};

/** Manual import — age range buckets */
export const CUSTOMER_AGE_RANGES = [
  "1-7",
  "7-14",
  "14-21",
  "21-40",
  "40+",
] as const;

export type CustomerAgeRange = (typeof CUSTOMER_AGE_RANGES)[number];

/** Manual import — gender */
export const CUSTOMER_GENDERS = ["male", "female", "other"] as const;

export type CustomerGender = (typeof CUSTOMER_GENDERS)[number];

/** Manual import — purchased category options */
export const PURCHASED_CATEGORY_OPTIONS = [
  "gold_and_stones",
  "silver_and_stones",
  "stones_and_roughs",
  "gold_and_gemstones",
  "silver_and_gemstones",
  "gemstones_and_special_roughs",
] as const;

export type PurchasedCategory = (typeof PURCHASED_CATEGORY_OPTIONS)[number];

/** Preferred display order for product categories in lists. */
export const PURCHASED_CATEGORY_DISPLAY_ORDER: PurchasedCategory[] = [
  "gold_and_gemstones",
  "gold_and_stones",
  "silver_and_gemstones",
  "silver_and_stones",
  "gemstones_and_special_roughs",
  "stones_and_roughs",
];

export const PURCHASED_CATEGORY_LABELS: Record<PurchasedCategory, string> = {
  gold_and_gemstones: "Gold and gemstone",
  gold_and_stones: "Gold and stones",
  silver_and_gemstones: "Silver and gemstone",
  silver_and_stones: "Silver and stones",
  gemstones_and_special_roughs: "Gemstones and Special roughs",
  stones_and_roughs: "Stones and roughs",
};

export type CustomerImportMode = "quick" | "history_included";

/** Full CRM profile captured during manual import with history */
export interface CustomerImportProfile {
  firstName: string;
  lastName: string;
  job?: string;
  phone: string;
  email?: string;
  address?: string;
  birthday?: string;
  marriageDate?: string;
  importantDate?: string;
  firstVisitDate?: string;
  gender?: CustomerGender;
  customerType: CustomerType;
  customerAgeRange?: CustomerAgeRange;
  purchasedCategories: PurchasedCategory[];
  description?: string;
  signature?: string;
}

export const BLOCK_REASONS: Record<BlockReasonCode, string> = {
  fraud_suspicion: "Fraud suspicion",
  payment_issues: "Payment issues",
  return_abuse: "Abuse of return policy",
  system_misuse: "System misuse",
};

export type FunnelPosition = "awareness" | "consideration" | "purchased";

export const FUNNEL_POSITION_LABELS: Record<FunnelPosition, string> = {
  awareness: "Awareness",
  consideration: "Consideration",
  purchased: "Purchased",
};

export interface CustomerSummary {
  id: string;
  fullName: string;
  phone: string;
  importProfile?: CustomerImportProfile;
  registeredAt: string;
  lastActivityAt: string;
  lastPurchaseDate?: string;
  totalOrders: number;
  totalLtv: number;
  segment: CustomerSegment;
  status: CustomerStatus;
  isVip: boolean;
  tags: CustomerTag[];
  customerType: CustomerType;
  purchasedCategories: PurchasedCategory[];
  customerAgeRange?: CustomerAgeRange;
  gender?: CustomerGender;
  country: "IR";
  href: string;
}

export interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  status: OrderStatus | string;
  itemCount: number;
  hasReturn: boolean;
  href: string;
}

export interface WishlistItem {
  id: string;
  productName: string;
  category: string;
  price: number;
  savedAt: string;
  isConfiguration: boolean;
  configurationSummary?: string;
}

export interface CustomerNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: AuditActionType;
  targetUserId: string;
  timestamp: string;
  reason?: string;
  details?: string;
}

export interface CategoryInsight {
  category: string;
  count: number;
  percentage: number;
}

export interface CustomerDetail extends CustomerSummary {
  email?: string;
  locale: "fa" | "en";
  defaultRingSize?: string;
  averageOrderValue: number;
  firstPurchaseDate?: string;
  vipSource: VipSource;
  topCategories: CategoryInsight[];
  wishlistCount: number;
  wishlistAdditions: number;
  wishlistRemovals: number;
  wishlistConversionRate: number;
  cartAbandonmentCount: number;
  configuratorUsageCount: number;
  engagementScore: number;
  repeatPurchaseRate: number;
  purchaseFrequency: number;
  funnelPosition: FunnelPosition;
  blockReason?: BlockReasonCode;
  blockNote?: string;
  orders: CustomerOrder[];
  wishlist: WishlistItem[];
  notes: CustomerNote[];
  auditLog: AuditLogEntry[];
  /** How the customer was manually imported, if applicable */
  importMode?: CustomerImportMode;
  /** Extended CRM data from history-included import */
  importProfile?: CustomerImportProfile;
}

export interface SavedSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  lastUpdated: string;
}

export const savedSegments: SavedSegment[] = [
  {
    id: "seg-ltv-high",
    name: "LTV > 500M Toman",
    description: "High-value customers above automatic VIP threshold",
    customerCount: 94,
    lastUpdated: "Jun 5, 2026",
  },
  {
    id: "seg-cart-abandon",
    name: "Cart abandoners (14d)",
    description: "Added to cart but no purchase in last 14 days",
    customerCount: 218,
    lastUpdated: "Jun 6, 2026",
  },
  {
    id: "seg-ring-browsers",
    name: "Ring browsers, no purchase",
    description: "Viewed rings > 5 times without converting",
    customerCount: 156,
    lastUpdated: "Jun 4, 2026",
  },
  {
    id: "seg-bridal",
    name: "Bridal intent",
    description: "Tagged bridal + engagement category views",
    customerCount: 73,
    lastUpdated: "Jun 3, 2026",
  },
];

const customerSummaries: CustomerSummary[] = [
  {
    id: "usr-001",
    fullName: "Sara Mohammadi",
    phone: "+989121234567",
    registeredAt: "2024-03-12",
    lastActivityAt: "2026-06-05",
    lastPurchaseDate: "2026-05-28",
    totalOrders: 8,
    totalLtv: 680_000_000,
    segment: "vip",
    status: "active",
    isVip: true,
    tags: ["VIP", "High spender", "Bridal customer"],
    customerType: "vip",
    purchasedCategories: ["gold_and_gemstones", "silver_and_stones"],
    customerAgeRange: "21-40",
    gender: "female",
    country: "IR",
    href: "/admin/customers/usr-001",
  },
  {
    id: "usr-002",
    fullName: "Ali Rezaei",
    phone: "+989351112233",
    registeredAt: "2025-01-08",
    lastActivityAt: "2026-06-06",
    lastPurchaseDate: "2026-06-02",
    totalOrders: 3,
    totalLtv: 245_000_000,
    segment: "active",
    status: "active",
    isVip: false,
    tags: ["High spender"],
    customerType: "public",
    purchasedCategories: ["gold_and_stones"],
    customerAgeRange: "14-21",
    gender: "male",
    country: "IR",
    href: "/admin/customers/usr-002",
  },
  {
    id: "usr-003",
    fullName: "Neda Karimi",
    phone: "+989211223344",
    registeredAt: "2023-11-20",
    lastActivityAt: "2026-06-04",
    lastPurchaseDate: "2026-04-15",
    totalOrders: 5,
    totalLtv: 412_000_000,
    segment: "returning",
    status: "active",
    isVip: true,
    tags: ["VIP"],
    customerType: "vip",
    purchasedCategories: ["gold_and_gemstones"],
    country: "IR",
    href: "/admin/customers/usr-003",
  },
  {
    id: "usr-004",
    fullName: "Reza Hosseini",
    phone: "+989191234567",
    registeredAt: "2026-05-20",
    lastActivityAt: "2026-06-06",
    lastPurchaseDate: undefined,
    totalOrders: 0,
    totalLtv: 0,
    segment: "new",
    status: "active",
    isVip: false,
    tags: [],
    customerType: "public",
    purchasedCategories: ["gold_and_stones"],
    country: "IR",
    href: "/admin/customers/usr-004",
  },
  {
    id: "usr-005",
    fullName: "Maryam Tavakoli",
    phone: "+989171234567",
    registeredAt: "2024-08-03",
    lastActivityAt: "2026-03-10",
    lastPurchaseDate: "2025-12-22",
    totalOrders: 2,
    totalLtv: 98_000_000,
    segment: "inactive",
    status: "active",
    isVip: false,
    tags: ["At-risk"],
    customerType: "public",
    purchasedCategories: ["silver_and_stones"],
    country: "IR",
    href: "/admin/customers/usr-005",
  },
  {
    id: "usr-006",
    fullName: "Hossein Ahmadi",
    phone: "+989151234567",
    registeredAt: "2025-06-14",
    lastActivityAt: "2026-05-30",
    lastPurchaseDate: "2026-05-15",
    totalOrders: 1,
    totalLtv: 125_000_000,
    segment: "active",
    status: "blocked",
    isVip: false,
    tags: [],
    customerType: "public",
    purchasedCategories: ["gold_and_stones"],
    country: "IR",
    href: "/admin/customers/usr-006",
  },
  {
    id: "usr-007",
    fullName: "Parisa Gholami",
    phone: "+989331234567",
    registeredAt: "2024-01-22",
    lastActivityAt: "2026-06-05",
    lastPurchaseDate: "2026-06-01",
    totalOrders: 6,
    totalLtv: 520_000_000,
    segment: "vip",
    status: "active",
    isVip: true,
    tags: ["VIP", "Bridal customer", "Influencer lead"],
    customerType: "vip",
    purchasedCategories: ["gold_and_gemstones", "gemstones_and_special_roughs"],
    country: "IR",
    href: "/admin/customers/usr-007",
  },
  {
    id: "usr-008",
    fullName: "Amir Kazemi",
    phone: "+989141234567",
    registeredAt: "2026-04-02",
    lastActivityAt: "2026-06-03",
    lastPurchaseDate: "2026-04-28",
    totalOrders: 1,
    totalLtv: 72_000_000,
    segment: "new",
    status: "active",
    isVip: false,
    tags: [],
    customerType: "public",
    purchasedCategories: ["gold_and_stones"],
    country: "IR",
    href: "/admin/customers/usr-008",
  },
];

const SEGMENTS: CustomerSummary["segment"][] = [
  "new",
  "active",
  "returning",
  "vip",
  "inactive",
];

const FIRST_NAMES = [
  "Fatemeh",
  "Mohammad",
  "Zahra",
  "Omid",
  "Leila",
  "Kian",
  "Shirin",
  "Babak",
  "Yasmin",
  "Farhad",
  "Niloofar",
  "Saeed",
  "Mahsa",
  "Arman",
  "Roxana",
  "Vahid",
];

const LAST_NAMES = [
  "Rahmani",
  "Jafari",
  "Nouri",
  "Salehi",
  "Bagheri",
  "Ebrahimi",
  "Shirazi",
  "Asgari",
  "Mousavi",
  "Tabatabaei",
];

const generatedCustomers: CustomerSummary[] = Array.from({ length: 22 }, (_, i) => {
  const n = i + 9;
  const id = `usr-${String(n).padStart(3, "0")}`;
  const segment = SEGMENTS[i % SEGMENTS.length];
  const totalOrders = segment === "new" && i % 3 === 0 ? 0 : (i % 6) + 1;
  const totalLtv = totalOrders * (45_000_000 + (i % 5) * 30_000_000);
  const month = String((i % 12) + 1).padStart(2, "0");

  return {
    id,
    fullName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    phone: `+98912${String(1000000 + n).slice(-7)}`,
    registeredAt: `202${4 + (i % 2)}-${month}-${String((i % 28) + 1).padStart(2, "0")}`,
    lastActivityAt: `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    lastPurchaseDate:
      totalOrders > 0 ? `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, "0")}` : undefined,
    totalOrders,
    totalLtv,
    segment,
    status: i % 17 === 0 ? "blocked" : "active",
    isVip: segment === "vip",
    tags: segment === "vip" ? (["VIP"] as CustomerTag[]) : [],
    customerType: segment === "vip" ? "vip" : "public",
    purchasedCategories:
      i % 2 === 0 ? (["gold_and_stones"] as PurchasedCategory[]) : (["silver_and_stones"] as PurchasedCategory[]),
    customerAgeRange: CUSTOMER_AGE_RANGES[i % CUSTOMER_AGE_RANGES.length],
    gender: i % 7 === 0 ? undefined : CUSTOMER_GENDERS[i % CUSTOMER_GENDERS.length],
    country: "IR",
    href: `/admin/customers/${id}`,
  };
});

export const customerList: CustomerSummary[] = [
  ...customerSummaries,
  ...generatedCustomers,
];

const customerDetails: Record<string, CustomerDetail> = {
  "usr-001": {
    ...customerSummaries[0],
    email: "sara.m@example.com",
    locale: "fa",
    defaultRingSize: "14",
    averageOrderValue: 85_000_000,
    firstPurchaseDate: "2024-04-02",
    vipSource: "automatic",
    topCategories: [
      { category: "Rings", count: 4, percentage: 50 },
      { category: "Necklaces", count: 2, percentage: 25 },
      { category: "Earrings", count: 2, percentage: 25 },
    ],
    wishlistCount: 5,
    wishlistAdditions: 12,
    wishlistRemovals: 7,
    wishlistConversionRate: 42,
    cartAbandonmentCount: 1,
    configuratorUsageCount: 6,
    engagementScore: 87,
    repeatPurchaseRate: 75,
    purchaseFrequency: 2.4,
    funnelPosition: "purchased",
    orders: [
      {
        id: "RG-2026-001234",
        date: "2026-05-28",
        total: 125_000_000,
        status: "delivered",
        itemCount: 1,
        hasReturn: false,
        href: "/admin/orders/RG-2026-001234",
      },
      {
        id: "RG-2026-001180",
        date: "2026-03-14",
        total: 95_000_000,
        status: "delivered",
        itemCount: 2,
        hasReturn: false,
        href: "/admin/orders/RG-2026-001180",
      },
      {
        id: "RG-2025-009842",
        date: "2025-11-02",
        total: 110_000_000,
        status: "delivered",
        itemCount: 1,
        hasReturn: false,
        href: "/admin/orders/RG-2025-009842",
      },
    ],
    wishlist: [
      {
        id: "wl-1",
        productName: "Liens pendant · rose gold",
        category: "Necklaces",
        price: 68_000_000,
        savedAt: "2026-06-01",
        isConfiguration: false,
      },
      {
        id: "wl-2",
        productName: "Custom solitaire ring",
        category: "Rings",
        price: 185_000_000,
        savedAt: "2026-05-20",
        isConfiguration: true,
        configurationSummary: "18K white gold · 1.2 ct diamond · size 14",
      },
    ],
    notes: [
      {
        id: "note-1",
        author: "CRM Team",
        body: "Interested in bridal set — follow up before wedding season.",
        createdAt: "2026-05-15T10:30:00Z",
      },
      {
        id: "note-2",
        author: "Support",
        body: "Requested ring resizing guidance — resolved via WhatsApp.",
        createdAt: "2026-03-20T14:00:00Z",
      },
    ],
    auditLog: [
      {
        id: "audit-1",
        adminId: "staff-01",
        adminName: "Admin User",
        action: "vip_assign",
        targetUserId: "usr-001",
        timestamp: "2025-06-01T09:00:00Z",
        details: "Automatic VIP — LTV threshold exceeded",
      },
      {
        id: "audit-2",
        adminId: "staff-03",
        adminName: "CRM Lead",
        action: "tag_add",
        targetUserId: "usr-001",
        timestamp: "2025-11-10T11:20:00Z",
        details: "Added tag: Bridal customer",
      },
    ],
  },
  "usr-006": {
    ...customerSummaries[5],
    locale: "fa",
    averageOrderValue: 125_000_000,
    firstPurchaseDate: "2026-05-15",
    vipSource: null,
    topCategories: [{ category: "Rings", count: 1, percentage: 100 }],
    wishlistCount: 0,
    wishlistAdditions: 2,
    wishlistRemovals: 2,
    wishlistConversionRate: 0,
    cartAbandonmentCount: 3,
    configuratorUsageCount: 1,
    engagementScore: 34,
    repeatPurchaseRate: 0,
    purchaseFrequency: 0,
    funnelPosition: "purchased",
    blockReason: "fraud_suspicion",
    blockNote: "Multiple failed payment attempts with mismatched cardholder names.",
    orders: [
      {
        id: "RG-2026-001210",
        date: "2026-05-15",
        total: 125_000_000,
        status: "delivered",
        itemCount: 1,
        hasReturn: true,
        href: "/admin/orders/RG-2026-001210",
      },
    ],
    wishlist: [],
    notes: [
      {
        id: "note-3",
        author: "Support",
        body: "Account blocked after 3 chargeback attempts. Escalated to fraud team.",
        createdAt: "2026-05-30T16:45:00Z",
      },
    ],
    auditLog: [
      {
        id: "audit-3",
        adminId: "staff-01",
        adminName: "Admin User",
        action: "block",
        targetUserId: "usr-006",
        timestamp: "2026-05-30T16:40:00Z",
        reason: "fraud_suspicion",
        details: "Multiple failed payment attempts with mismatched cardholder names.",
      },
    ],
  },
};

function buildDefaultDetail(summary: CustomerSummary): CustomerDetail {
  return {
    ...summary,
    locale: "fa",
    averageOrderValue:
      summary.totalOrders > 0
        ? Math.round(summary.totalLtv / summary.totalOrders)
        : 0,
    firstPurchaseDate: summary.registeredAt,
    vipSource: summary.isVip ? "automatic" : null,
    topCategories: [],
    wishlistCount: 0,
    wishlistAdditions: 0,
    wishlistRemovals: 0,
    wishlistConversionRate: 0,
    cartAbandonmentCount: 0,
    configuratorUsageCount: 0,
    engagementScore: summary.segment === "inactive" ? 22 : 55,
    repeatPurchaseRate: summary.totalOrders > 1 ? 50 : 0,
    purchaseFrequency: summary.totalOrders > 0 ? 1.2 : 0,
    funnelPosition:
      summary.totalOrders > 0 ? "purchased" : "awareness",
    orders: [],
    wishlist: [],
    notes: [],
    auditLog: [],
  };
}

export function getCustomerById(id: string): CustomerDetail | undefined {
  if (customerDetails[id]) {
    return customerDetails[id];
  }
  const summary = customerSummaries.find((c) => c.id === id);
  return summary ? buildDefaultDetail(summary) : undefined;
}

export function getAllCustomerDetails(): CustomerDetail[] {
  return customerSummaries.map(
    (summary) => customerDetails[summary.id] ?? buildDefaultDetail(summary),
  );
}
