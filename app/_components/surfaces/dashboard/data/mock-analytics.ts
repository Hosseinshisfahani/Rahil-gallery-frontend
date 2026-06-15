import type { StatCardProps } from "../abstract/dashboard-card";

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export interface MetricRow {
  label: string;
  value: string;
  secondary?: string;
  barPercent?: number;
  trend?: StatCardProps["trend"];
}

export interface RankedSku {
  rank: number;
  sku: string;
  name: string;
  value: string;
  metric: string;
  barPercent: number;
}

export interface FunnelStep {
  label: string;
  count: number;
  rateFromPrevious?: number;
  rateFromSession?: number;
  dropOff?: number;
}

export interface CampaignRow {
  name: string;
  channel: string;
  spend: string;
  revenue: string;
  roas: string;
  ctr: string;
  conversion: string;
}

export interface CohortRow {
  cohort: string;
  customers: number;
  repeatRate: string;
  avgLtv: string;
}

/** Core business health — Executive dashboard */
export const executiveKpis: StatCardProps[] = [
  {
    id: "netRevenue",
    label: "Net revenue",
    value: "۱.۲B",
    change: "+8.4% vs prior 30d",
    trend: "up",
  },
  {
    id: "orders",
    label: "Orders",
    value: "342",
    change: "+12% vs prior 30d",
    trend: "up",
  },
  {
    id: "conversionRate",
    label: "Conversion rate",
    value: "2.8%",
    change: "+0.3pp vs prior 30d",
    trend: "up",
  },
  {
    id: "aov",
    label: "Average order value",
    value: "۳.۵M",
    change: "+4.1% vs prior 30d",
    trend: "up",
  },
  {
    id: "cac",
    label: "CAC",
    value: "۴۸۰K",
    change: "−6% vs prior 30d",
    trend: "up",
  },
  {
    id: "ltv",
    label: "LTV",
    value: "۸.۲M",
    change: "+2.1% vs prior 30d",
    trend: "up",
  },
  {
    id: "ltvCac",
    label: "LTV:CAC ratio",
    value: "17.1×",
    change: "Target > 3× · healthy",
    trend: "up",
  },
  {
    id: "grossMargin",
    label: "Gross margin",
    value: "62.4%",
    change: "+0.8pp vs prior 30d",
    trend: "up",
  },
  {
    id: "returnRate",
    label: "Return rate",
    value: "3.2%",
    change: "−0.4pp vs prior 30d",
    trend: "up",
  },
  {
    id: "roasBlended",
    label: "ROAS (blended)",
    value: "4.6×",
    change: "+0.5× vs prior 30d",
    trend: "up",
  },
];

export const topProductsByRevenue: RankedSku[] = [
  {
    rank: 1,
    sku: "RNG-SOL-1CT",
    name: "Solitaire ring · 1 ct diamond",
    value: "۱۸۵M",
    metric: "18.2% of revenue",
    barPercent: 100,
  },
  {
    rank: 2,
    sku: "NCK-LIENS-PND",
    name: "Liens pendant necklace",
    value: "۱۲۴M",
    metric: "12.2% of revenue",
    barPercent: 67,
  },
  {
    rank: 3,
    sku: "SET-BRIDAL-01",
    name: "Bridal set · ring + earrings",
    value: "۹۸M",
    metric: "9.6% of revenue",
    barPercent: 53,
  },
  {
    rank: 4,
    sku: "ER-STUD-0.5",
    name: "Diamond stud earrings · 0.5 ct",
    value: "۷۶M",
    metric: "7.5% of revenue",
    barPercent: 41,
  },
  {
    rank: 5,
    sku: "BRC-CHAIN-ADJ",
    name: "Chain bracelet · adjustable",
    value: "۵۸M",
    metric: "5.7% of revenue",
    barPercent: 31,
  },
];

/** Marketing & acquisition */
export const marketingKpis: StatCardProps[] = [
  {
    id: "blendedRoas",
    label: "Blended ROAS",
    value: "4.6×",
    change: "Paid + social combined",
    trend: "up",
  },
  {
    id: "totalAdSpend",
    label: "Total ad spend",
    value: "۱۴۲M",
    change: "+5% vs prior 30d",
    trend: "neutral",
  },
  {
    id: "emailRevenueShare",
    label: "Email revenue share",
    value: "14.2%",
    change: "+1.1pp vs prior 30d",
    trend: "up",
  },
  {
    id: "organicRevenueShare",
    label: "Organic revenue share",
    value: "38.5%",
    change: "Stable",
    trend: "neutral",
  },
];

export const channelRevenueMix: MetricRow[] = [
  { label: "Organic search", value: "38.5%", barPercent: 100, secondary: "۳۹۲M" },
  { label: "Paid search", value: "22.1%", barPercent: 57, secondary: "۲۲۵M" },
  { label: "Social (paid)", value: "16.8%", barPercent: 44, secondary: "۱۷۱M" },
  { label: "Email", value: "14.2%", barPercent: 37, secondary: "۱۴۵M" },
  { label: "Influencers", value: "5.4%", barPercent: 14, secondary: "۵۵M" },
  { label: "Direct / other", value: "3.0%", barPercent: 8, secondary: "۳۱M" },
];

export const cacByChannel: MetricRow[] = [
  { label: "Paid search", value: "۵۲۰K", barPercent: 100, secondary: "Highest volume" },
  { label: "Social (paid)", value: "۴۸۰K", barPercent: 92, secondary: "Best ROAS 5.2×" },
  { label: "Influencers", value: "۶۸۰K", barPercent: 131, secondary: "8.4% conv. rate" },
  { label: "Email", value: "۱۲۰K", barPercent: 23, secondary: "Retargeting only" },
  { label: "Organic", value: "—", barPercent: 0, secondary: "No direct spend" },
];

export const influencerMetrics: MetricRow[] = [
  { label: "Influencer conversion rate", value: "8.4%", trend: "up" },
  { label: "Avg. orders per campaign", value: "24", trend: "neutral" },
  { label: "Revenue per influencer post", value: "۱۱.۲M", trend: "up" },
  { label: "Influencer ROAS", value: "3.8×", trend: "up" },
];

export const campaigns: CampaignRow[] = [
  {
    name: "Spring bridal · Meta",
    channel: "Social",
    spend: "۲۸M",
    revenue: "۱۴۵M",
    roas: "5.2×",
    ctr: "2.4%",
    conversion: "3.1%",
  },
  {
    name: "Liens collection · Google",
    channel: "Paid search",
    spend: "۳۵M",
    revenue: "۱۶۸M",
    roas: "4.8×",
    ctr: "4.1%",
    conversion: "2.9%",
  },
  {
    name: "Engagement rings · Retarget",
    channel: "Email",
    spend: "۲M",
    revenue: "۴۲M",
    roas: "21×",
    ctr: "8.2%",
    conversion: "5.6%",
  },
  {
    name: "Nowruz gift guide · Influencer",
    channel: "Influencer",
    spend: "۱۸M",
    revenue: "۵۵M",
    roas: "3.1×",
    ctr: "1.8%",
    conversion: "8.4%",
  },
];

/** Product performance */
export const productKpis: StatCardProps[] = [
  {
    id: "viewToCart",
    label: "View → add-to-cart",
    value: "12.4%",
    change: "+0.6pp vs prior 30d",
    trend: "up",
  },
  {
    id: "cartToPurchase",
    label: "Cart → purchase",
    value: "22.6%",
    change: "−0.2pp vs prior 30d",
    trend: "down",
  },
  {
    id: "inventoryTurnover",
    label: "Inventory turnover",
    value: "4.2×",
    change: "Annualized · jewelry avg 3–5×",
    trend: "neutral",
  },
  {
    id: "stockoutRate",
    label: "Stockout rate",
    value: "2.1%",
    change: "4 SKUs affected",
    trend: "down",
  },
];

export const skuRevenueContribution: RankedSku[] = [
  {
    rank: 1,
    sku: "RNG-SOL-1CT",
    name: "Solitaire ring · 1 ct",
    value: "۱۸.2%",
    metric: "۱۸۵M revenue",
    barPercent: 100,
  },
  {
    rank: 2,
    sku: "NCK-LIENS-PND",
    name: "Liens pendant",
    value: "12.2%",
    metric: "۱۲۴M revenue",
    barPercent: 67,
  },
  {
    rank: 3,
    sku: "SET-BRIDAL-01",
    name: "Bridal set",
    value: "9.6%",
    metric: "۹۸M revenue",
    barPercent: 53,
  },
  {
    rank: 4,
    sku: "RNG-CUSTOM",
    name: "Custom engagement (configurator)",
    value: "8.1%",
    metric: "۸۲M revenue",
    barPercent: 45,
  },
  {
    rank: 5,
    sku: "ER-STUD-0.5",
    name: "Diamond studs · 0.5 ct",
    value: "7.5%",
    metric: "۷۶M revenue",
    barPercent: 41,
  },
];

export const skuMarginContribution: RankedSku[] = [
  {
    rank: 1,
    sku: "RNG-CUSTOM",
    name: "Custom engagement",
    value: "68%",
    metric: "Highest margin · made-to-order",
    barPercent: 100,
  },
  {
    rank: 2,
    sku: "SET-BRIDAL-01",
    name: "Bridal set",
    value: "64%",
    metric: "Bundle pricing",
    barPercent: 94,
  },
  {
    rank: 3,
    sku: "RNG-SOL-1CT",
    name: "Solitaire ring · 1 ct",
    value: "58%",
    metric: "Volume driver",
    barPercent: 85,
  },
  {
    rank: 4,
    sku: "NCK-LIENS-PND",
    name: "Liens pendant",
    value: "61%",
    metric: "Strong accessory margin",
    barPercent: 90,
  },
  {
    rank: 5,
    sku: "BRC-CHAIN-ADJ",
    name: "Chain bracelet",
    value: "55%",
    metric: "Entry price point",
    barPercent: 81,
  },
];

export const inventoryStatus: MetricRow[] = [
  { label: "In stock · ready to ship", value: "142 SKUs", barPercent: 72 },
  { label: "Made-to-order only", value: "48 SKUs", barPercent: 24 },
  { label: "Out of stock", value: "4 SKUs", barPercent: 4, trend: "down" },
  { label: "Low stock (≤ 3 units)", value: "11 SKUs", barPercent: 6, trend: "down" },
];

/** Customer behavior */
export const customerKpis: StatCardProps[] = [
  {
    id: "ltv",
    label: "Lifetime value (LTV)",
    value: "۸.۲M",
    change: "+2.1% vs prior 30d",
    trend: "up",
  },
  {
    id: "repeatRate",
    label: "Repeat purchase rate",
    value: "28.4%",
    change: "+1.8pp vs prior 30d",
    trend: "up",
  },
  {
    id: "avgTimeBetween",
    label: "Avg. time between purchases",
    value: "142 days",
    change: "Gift & occasion driven",
    trend: "neutral",
  },
  {
    id: "wishlistRate",
    label: "Wishlist rate",
    value: "18.6%",
    change: "Sessions adding to wishlist",
    trend: "up",
  },
  {
    id: "cartAbandonment",
    label: "Cart abandonment",
    value: "71.2%",
    change: "−1.4pp vs prior 30d",
    trend: "up",
  },
];

export const firstPurchaseCategories: MetricRow[] = [
  { label: "Rings", value: "42.1%", barPercent: 100, secondary: "Engagement-led" },
  { label: "Necklaces", value: "24.8%", barPercent: 59, secondary: "Gift occasions" },
  { label: "Earrings", value: "15.3%", barPercent: 36, secondary: "Entry luxury" },
  { label: "Sets", value: "10.2%", barPercent: 24, secondary: "Bridal bundles" },
  { label: "Bracelets", value: "5.4%", barPercent: 13, secondary: "Self-purchase" },
  { label: "Custom / configurator", value: "2.2%", barPercent: 5, secondary: "High AOV" },
];

export const customerCohorts: CohortRow[] = [
  { cohort: "Jan 2026", customers: 84, repeatRate: "22%", avgLtv: "۶.۸M" },
  { cohort: "Dec 2025", customers: 112, repeatRate: "31%", avgLtv: "۷.۴M" },
  { cohort: "Nov 2025", customers: 98, repeatRate: "29%", avgLtv: "۷.۱M" },
  { cohort: "Oct 2025", customers: 76, repeatRate: "26%", avgLtv: "۶.۵M" },
];

/** Funnel metrics */
export const funnelKpis: StatCardProps[] = [
  {
    id: "productViewRate",
    label: "Product view rate",
    value: "68.4%",
    change: "Sessions viewing ≥1 PDP",
    trend: "neutral",
  },
  {
    id: "cartConversion",
    label: "Cart conversion",
    value: "12.4%",
    change: "PDP view → add to cart",
    trend: "up",
  },
  {
    id: "checkoutDropOff",
    label: "Checkout drop-off",
    value: "38.2%",
    change: "Cart → abandoned checkout",
    trend: "down",
  },
  {
    id: "paymentFailureRate",
    label: "Payment failure rate",
    value: "4.8%",
    change: "Gateway declines + timeouts",
    trend: "down",
  },
];

export const ecommerceFunnel: FunnelStep[] = [
  {
    label: "Sessions",
    count: 12_240,
    rateFromSession: 100,
  },
  {
    label: "Product view",
    count: 8_372,
    rateFromPrevious: 68.4,
    rateFromSession: 68.4,
    dropOff: 31.6,
  },
  {
    label: "Add to cart",
    count: 1_038,
    rateFromPrevious: 12.4,
    rateFromSession: 8.5,
    dropOff: 87.6,
  },
  {
    label: "Checkout started",
    count: 642,
    rateFromPrevious: 61.8,
    rateFromSession: 5.2,
    dropOff: 38.2,
  },
  {
    label: "Purchase",
    count: 342,
    rateFromPrevious: 53.3,
    rateFromSession: 2.8,
    dropOff: 46.7,
  },
];

export const deviceBreakdown: MetricRow[] = [
  { label: "Mobile", value: "62.4%", barPercent: 100, secondary: "2.4% CR" },
  { label: "Desktop", value: "31.2%", barPercent: 50, secondary: "3.6% CR" },
  { label: "Tablet", value: "6.4%", barPercent: 10, secondary: "2.1% CR" },
];

export const checkoutDropOffSteps: MetricRow[] = [
  { label: "Address entry", value: "12.4%", barPercent: 32, secondary: "Of checkout exits" },
  { label: "Shipping method", value: "8.1%", barPercent: 21, secondary: "Of checkout exits" },
  { label: "Payment gateway", value: "18.6%", barPercent: 49, secondary: "Highest drop-off" },
  { label: "Order review", value: "6.2%", barPercent: 16, secondary: "Of checkout exits" },
];

export const paymentFailureBreakdown: MetricRow[] = [
  { label: "Insufficient funds", value: "42%", barPercent: 100 },
  { label: "Gateway timeout", value: "28%", barPercent: 67 },
  { label: "User cancelled", value: "18%", barPercent: 43 },
  { label: "Bank decline (other)", value: "12%", barPercent: 29 },
];
