import type { AdminLocale } from "@/lib/admin-locale";
import {
  formatCompactCurrency,
  formatCount,
  formatMultiplier,
  formatPercent,
} from "@/lib/analytics/format";
import {
  periodDays,
  periodVolumeScale,
  type AnalyticsPeriod,
} from "@/lib/analytics/period";
import type { StatCardProps } from "../abstract/dashboard-card";
import type {
  CampaignRow,
  CohortRow,
  FunnelStep,
  MetricRow,
  RankedSku,
} from "./mock-analytics";

export interface AnalyticsSnapshot {
  period: AnalyticsPeriod;
  periodDays: number;
  executiveKpis: StatCardProps[];
  topProductsByRevenue: RankedSku[];
  marketingKpis: StatCardProps[];
  channelRevenueMix: MetricRow[];
  cacByChannel: MetricRow[];
  influencerMetrics: MetricRow[];
  campaigns: CampaignRow[];
  productKpis: StatCardProps[];
  skuRevenueContribution: RankedSku[];
  skuMarginContribution: RankedSku[];
  inventoryStatus: MetricRow[];
  customerKpis: StatCardProps[];
  firstPurchaseCategories: MetricRow[];
  customerCohorts: CohortRow[];
  funnelKpis: StatCardProps[];
  ecommerceFunnel: FunnelStep[];
  deviceBreakdown: MetricRow[];
  checkoutDropOffSteps: MetricRow[];
  paymentFailureBreakdown: MetricRow[];
}

function periodDelta(period: AnalyticsPeriod): number {
  switch (period) {
    case "7d":
      return -0.4;
    case "90d":
      return 1.2;
    default:
      return 0;
  }
}

function adjustRate(base: number, period: AnalyticsPeriod): number {
  return Math.round((base + periodDelta(period)) * 10) / 10;
}

function comparisonChange(
  metric: string,
  delta: number,
  unit: "percent" | "pp" | "multiplier" = "percent",
): string {
  const sign = delta >= 0 ? "+" : "";
  if (unit === "pp") {
    return `${sign}${delta}pp vs prior period · ${metric}`;
  }
  if (unit === "multiplier") {
    return `${sign}${delta}× vs prior period · ${metric}`;
  }
  return `${sign}${delta}% vs prior period · ${metric}`;
}

export function getAnalyticsSnapshot(
  period: AnalyticsPeriod,
  locale: AdminLocale,
): AnalyticsSnapshot {
  const scale = periodVolumeScale(period);
  const days = periodDays(period);

  const netRevenue = Math.round(1_200_000_000 * scale);
  const orders = Math.round(342 * scale);
  const adSpend = Math.round(142_000_000 * scale);
  const sessions = Math.round(12_240 * scale);
  const conversionRate = adjustRate(2.8, period);
  const productViewRate = adjustRate(68.4, period);
  const cartConversion = adjustRate(12.4, period);
  const checkoutDropOff = adjustRate(38.2, period);
  const paymentFailure = adjustRate(4.8, period);
  const overallConversion = conversionRate;

  const productViews = Math.round(sessions * (productViewRate / 100));
  const addToCart = Math.round(productViews * (cartConversion / 100));
  const checkoutStarted = Math.round(addToCart * 0.618);
  const purchases = orders;

  const executiveKpis: StatCardProps[] = [
    {
      id: "netRevenue",
      label: "Net revenue",
      value: formatCompactCurrency(netRevenue, locale),
      change: comparisonChange("net revenue", period === "7d" ? 5.2 : period === "90d" ? 11.4 : 8.4),
      trend: "up",
    },
    {
      id: "orders",
      label: "Orders",
      value: formatCount(orders, locale),
      change: comparisonChange("orders", period === "7d" ? 8 : period === "90d" ? 15 : 12),
      trend: "up",
    },
    {
      id: "conversionRate",
      label: "Conversion rate",
      value: formatPercent(conversionRate, locale),
      change: comparisonChange("conversion", period === "7d" ? 0.1 : 0.3, "pp"),
      trend: "up",
    },
    {
      id: "aov",
      label: "Average order value",
      value: formatCompactCurrency(Math.round(netRevenue / Math.max(orders, 1)), locale),
      change: comparisonChange("AOV", period === "7d" ? 2.8 : 4.1),
      trend: "up",
    },
    {
      id: "cac",
      label: "CAC",
      value: formatCompactCurrency(480_000, locale),
      change: comparisonChange("CAC", period === "7d" ? -4 : -6),
      trend: "up",
    },
    {
      id: "ltv",
      label: "LTV",
      value: formatCompactCurrency(8_200_000, locale),
      change: comparisonChange("LTV", period === "90d" ? 3.4 : 2.1),
      trend: "up",
    },
    {
      id: "ltvCac",
      label: "LTV:CAC ratio",
      value: formatMultiplier(17.1, locale),
      change: "Target > 3× · healthy",
      trend: "up",
    },
    {
      id: "grossMargin",
      label: "Gross margin",
      value: formatPercent(62.4, locale),
      change: comparisonChange("margin", period === "90d" ? 1.1 : 0.8, "pp"),
      trend: "up",
    },
    {
      id: "returnRate",
      label: "Return rate",
      value: formatPercent(3.2, locale),
      change: comparisonChange("returns", -0.4, "pp"),
      trend: "up",
    },
    {
      id: "roasBlended",
      label: "ROAS (blended)",
      value: formatMultiplier(4.6, locale),
      change: comparisonChange("ROAS", 0.5, "multiplier"),
      trend: "up",
    },
  ];

  const topProductsByRevenue: RankedSku[] = [
    {
      rank: 1,
      sku: "RNG-SOL-1CT",
      name: "Solitaire ring · 1 ct diamond",
      value: formatCompactCurrency(Math.round(185_000_000 * scale), locale),
      metric: "18.2% of revenue",
      barPercent: 100,
    },
    {
      rank: 2,
      sku: "NCK-LIENS-PND",
      name: "Liens pendant necklace",
      value: formatCompactCurrency(Math.round(124_000_000 * scale), locale),
      metric: "12.2% of revenue",
      barPercent: 67,
    },
    {
      rank: 3,
      sku: "SET-BRIDAL-01",
      name: "Bridal set · ring + earrings",
      value: formatCompactCurrency(Math.round(98_000_000 * scale), locale),
      metric: "9.6% of revenue",
      barPercent: 53,
    },
    {
      rank: 4,
      sku: "ER-STUD-0.5",
      name: "Diamond stud earrings · 0.5 ct",
      value: formatCompactCurrency(Math.round(76_000_000 * scale), locale),
      metric: "7.5% of revenue",
      barPercent: 41,
    },
    {
      rank: 5,
      sku: "BRC-CHAIN-ADJ",
      name: "Chain bracelet · adjustable",
      value: formatCompactCurrency(Math.round(58_000_000 * scale), locale),
      metric: "5.7% of revenue",
      barPercent: 31,
    },
  ];

  const channelAmounts = [
    { label: "Organic search", share: 38.5, amount: Math.round(392_000_000 * scale) },
    { label: "Paid search", share: 22.1, amount: Math.round(225_000_000 * scale) },
    { label: "Social (paid)", share: 16.8, amount: Math.round(171_000_000 * scale) },
    { label: "Email", share: 14.2, amount: Math.round(145_000_000 * scale) },
    { label: "Influencers", share: 5.4, amount: Math.round(55_000_000 * scale) },
    { label: "Direct / other", share: 3.0, amount: Math.round(31_000_000 * scale) },
  ];

  const marketingKpis: StatCardProps[] = [
    {
      id: "blendedRoas",
      label: "Blended ROAS",
      value: formatMultiplier(4.6, locale),
      change: "Paid + social combined",
      trend: "up",
    },
    {
      id: "totalAdSpend",
      label: "Total ad spend",
      value: formatCompactCurrency(adSpend, locale),
      change: comparisonChange("ad spend", period === "90d" ? 8 : 5),
      trend: "neutral",
    },
    {
      id: "emailRevenueShare",
      label: "Email revenue share",
      value: formatPercent(14.2, locale),
      change: comparisonChange("email share", 1.1, "pp"),
      trend: "up",
    },
    {
      id: "organicRevenueShare",
      label: "Organic revenue share",
      value: formatPercent(38.5, locale),
      change: "Stable",
      trend: "neutral",
    },
  ];

  const channelRevenueMix: MetricRow[] = channelAmounts.map((row, index) => ({
    label: row.label,
    value: formatPercent(row.share, locale),
    barPercent: index === 0 ? 100 : Math.round((row.share / 38.5) * 100),
    secondary: formatCompactCurrency(row.amount, locale),
  }));

  const cacByChannel: MetricRow[] = [
    {
      label: "Paid search",
      value: formatCompactCurrency(520_000, locale),
      barPercent: 100,
      secondary: "Highest volume",
    },
    {
      label: "Social (paid)",
      value: formatCompactCurrency(480_000, locale),
      barPercent: 92,
      secondary: "Best ROAS 5.2×",
    },
    {
      label: "Influencers",
      value: formatCompactCurrency(680_000, locale),
      barPercent: 131,
      secondary: "8.4% conv. rate",
    },
    {
      label: "Email",
      value: formatCompactCurrency(120_000, locale),
      barPercent: 23,
      secondary: "Retargeting only",
    },
    { label: "Organic", value: "—", barPercent: 0, secondary: "No direct spend" },
  ];

  const influencerMetrics: MetricRow[] = [
    { label: "Influencer conversion rate", value: formatPercent(8.4, locale), trend: "up" },
    {
      label: "Avg. orders per campaign",
      value: formatCount(Math.max(8, Math.round(24 * scale)), locale),
      trend: "neutral",
    },
    {
      label: "Revenue per influencer post",
      value: formatCompactCurrency(Math.round(11_200_000 * scale), locale),
      trend: "up",
    },
    { label: "Influencer ROAS", value: formatMultiplier(3.8, locale), trend: "up" },
  ];

  const campaigns: CampaignRow[] = [
    {
      name: "Spring bridal · Meta",
      channel: "Social",
      spend: formatCompactCurrency(Math.round(28_000_000 * scale), locale),
      revenue: formatCompactCurrency(Math.round(145_000_000 * scale), locale),
      roas: formatMultiplier(5.2, locale),
      ctr: formatPercent(2.4, locale),
      conversion: formatPercent(3.1, locale),
    },
    {
      name: "Liens collection · Google",
      channel: "Paid search",
      spend: formatCompactCurrency(Math.round(35_000_000 * scale), locale),
      revenue: formatCompactCurrency(Math.round(168_000_000 * scale), locale),
      roas: formatMultiplier(4.8, locale),
      ctr: formatPercent(4.1, locale),
      conversion: formatPercent(2.9, locale),
    },
    {
      name: "Engagement rings · Retarget",
      channel: "Email",
      spend: formatCompactCurrency(Math.round(2_000_000 * scale), locale),
      revenue: formatCompactCurrency(Math.round(42_000_000 * scale), locale),
      roas: formatMultiplier(21, locale),
      ctr: formatPercent(8.2, locale),
      conversion: formatPercent(5.6, locale),
    },
    {
      name: "Nowruz gift guide · Influencer",
      channel: "Influencer",
      spend: formatCompactCurrency(Math.round(18_000_000 * scale), locale),
      revenue: formatCompactCurrency(Math.round(55_000_000 * scale), locale),
      roas: formatMultiplier(3.1, locale),
      ctr: formatPercent(1.8, locale),
      conversion: formatPercent(8.4, locale),
    },
  ];

  const productKpis: StatCardProps[] = [
    {
      id: "viewToCart",
      label: "View → add-to-cart",
      value: formatPercent(cartConversion, locale),
      change: comparisonChange("view→cart", 0.6, "pp"),
      trend: "up",
    },
    {
      id: "cartToPurchase",
      label: "Cart → purchase",
      value: formatPercent(22.6, locale),
      change: comparisonChange("cart→purchase", -0.2, "pp"),
      trend: "down",
    },
    {
      id: "inventoryTurnover",
      label: "Inventory turnover",
      value: formatMultiplier(4.2, locale),
      change: "Annualized · jewelry avg 3–5×",
      trend: "neutral",
    },
    {
      id: "stockoutRate",
      label: "Stockout rate",
      value: formatPercent(2.1, locale),
      change: "4 SKUs affected",
      trend: "down",
    },
  ];

  const skuRevenueContribution: RankedSku[] = topProductsByRevenue.map((item, index) => ({
    rank: item.rank,
    sku: item.sku,
    name: item.name.split(" · ")[0],
    value: ["18.2%", "12.2%", "9.6%", "8.1%", "7.5%"][index],
    metric: `${item.value} revenue`,
    barPercent: item.barPercent,
  }));

  const skuMarginContribution: RankedSku[] = [
    {
      rank: 1,
      sku: "RNG-CUSTOM",
      name: "Custom engagement",
      value: formatPercent(68, locale, 0),
      metric: "Highest margin · made-to-order",
      barPercent: 100,
    },
    {
      rank: 2,
      sku: "SET-BRIDAL-01",
      name: "Bridal set",
      value: formatPercent(64, locale, 0),
      metric: "Bundle pricing",
      barPercent: 94,
    },
    {
      rank: 3,
      sku: "RNG-SOL-1CT",
      name: "Solitaire ring · 1 ct",
      value: formatPercent(58, locale, 0),
      metric: "Volume driver",
      barPercent: 85,
    },
    {
      rank: 4,
      sku: "NCK-LIENS-PND",
      name: "Liens pendant",
      value: formatPercent(61, locale, 0),
      metric: "Strong accessory margin",
      barPercent: 90,
    },
    {
      rank: 5,
      sku: "BRC-CHAIN-ADJ",
      name: "Chain bracelet",
      value: formatPercent(55, locale, 0),
      metric: "Entry price point",
      barPercent: 81,
    },
  ];

  const inventoryStatus: MetricRow[] = [
    { label: "In stock · ready to ship", value: "142 SKUs", barPercent: 72 },
    { label: "Made-to-order only", value: "48 SKUs", barPercent: 24 },
    { label: "Out of stock", value: "4 SKUs", barPercent: 4, trend: "down" },
    { label: "Low stock (≤ 3 units)", value: "11 SKUs", barPercent: 6, trend: "down" },
  ];

  const customerKpis: StatCardProps[] = [
    {
      id: "ltv",
      label: "Lifetime value (LTV)",
      value: formatCompactCurrency(8_200_000, locale),
      change: comparisonChange("LTV", period === "90d" ? 3.4 : 2.1),
      trend: "up",
    },
    {
      id: "repeatRate",
      label: "Repeat purchase rate",
      value: formatPercent(28.4, locale),
      change: comparisonChange("repeat rate", 1.8, "pp"),
      trend: "up",
    },
    {
      id: "avgTimeBetween",
      label: "Avg. time between purchases",
      value: locale === "fa" ? "۱۴۲ روز" : "142 days",
      change: "Gift & occasion driven",
      trend: "neutral",
    },
    {
      id: "wishlistRate",
      label: "Wishlist rate",
      value: formatPercent(18.6, locale),
      change: "Sessions adding to wishlist",
      trend: "up",
    },
    {
      id: "cartAbandonment",
      label: "Cart abandonment",
      value: formatPercent(71.2, locale),
      change: comparisonChange("abandonment", -1.4, "pp"),
      trend: "up",
    },
  ];

  const firstPurchaseCategories: MetricRow[] = [
    { label: "Rings", value: formatPercent(42.1, locale), barPercent: 100, secondary: "Engagement-led" },
    { label: "Necklaces", value: formatPercent(24.8, locale), barPercent: 59, secondary: "Gift occasions" },
    { label: "Earrings", value: formatPercent(15.3, locale), barPercent: 36, secondary: "Entry luxury" },
    { label: "Sets", value: formatPercent(10.2, locale), barPercent: 24, secondary: "Bridal bundles" },
    { label: "Bracelets", value: formatPercent(5.4, locale), barPercent: 13, secondary: "Self-purchase" },
    { label: "Custom / configurator", value: formatPercent(2.2, locale), barPercent: 5, secondary: "High AOV" },
  ];

  const customerCohorts: CohortRow[] = [
    {
      cohort: locale === "fa" ? "ژانویه ۲۰۲۶" : "Jan 2026",
      customers: Math.max(20, Math.round(84 * scale)),
      repeatRate: formatPercent(22, locale, 0),
      avgLtv: formatCompactCurrency(6_800_000, locale),
    },
    {
      cohort: locale === "fa" ? "دسامبر ۲۰۲۵" : "Dec 2025",
      customers: Math.max(28, Math.round(112 * scale)),
      repeatRate: formatPercent(31, locale, 0),
      avgLtv: formatCompactCurrency(7_400_000, locale),
    },
    {
      cohort: locale === "fa" ? "نوامبر ۲۰۲۵" : "Nov 2025",
      customers: Math.max(24, Math.round(98 * scale)),
      repeatRate: formatPercent(29, locale, 0),
      avgLtv: formatCompactCurrency(7_100_000, locale),
    },
    {
      cohort: locale === "fa" ? "اکتبر ۲۰۲۵" : "Oct 2025",
      customers: Math.max(18, Math.round(76 * scale)),
      repeatRate: formatPercent(26, locale, 0),
      avgLtv: formatCompactCurrency(6_500_000, locale),
    },
  ];

  const funnelKpis: StatCardProps[] = [
    {
      id: "productViewRate",
      label: "Product view rate",
      value: formatPercent(productViewRate, locale),
      change: "Sessions viewing ≥1 PDP",
      trend: "neutral",
    },
    {
      id: "cartConversion",
      label: "Cart conversion",
      value: formatPercent(cartConversion, locale),
      change: "PDP view → add to cart",
      trend: "up",
    },
    {
      id: "overallConversion",
      label: "Overall conversion",
      value: formatPercent(overallConversion, locale),
      change: "Sessions → purchase",
      trend: "up",
    },
    {
      id: "checkoutDropOff",
      label: "Checkout drop-off",
      value: formatPercent(checkoutDropOff, locale),
      change: "Cart → abandoned checkout",
      trend: "down",
    },
    {
      id: "paymentFailureRate",
      label: "Payment failure rate",
      value: formatPercent(paymentFailure, locale),
      change: "Gateway declines + timeouts",
      trend: "down",
    },
  ];

  const ecommerceFunnel: FunnelStep[] = [
    { label: "Sessions", count: sessions, rateFromSession: 100 },
    {
      label: "Product view",
      count: productViews,
      rateFromPrevious: productViewRate,
      rateFromSession: productViewRate,
      dropOff: Math.round((100 - productViewRate) * 10) / 10,
    },
    {
      label: "Add to cart",
      count: addToCart,
      rateFromPrevious: cartConversion,
      rateFromSession: Math.round((addToCart / Math.max(sessions, 1)) * 1000) / 10,
      dropOff: Math.round((100 - cartConversion) * 10) / 10,
    },
    {
      label: "Checkout started",
      count: checkoutStarted,
      rateFromPrevious: 61.8,
      rateFromSession: Math.round((checkoutStarted / Math.max(sessions, 1)) * 1000) / 10,
      dropOff: checkoutDropOff,
    },
    {
      label: "Purchase",
      count: purchases,
      rateFromPrevious: Math.round((purchases / Math.max(checkoutStarted, 1)) * 1000) / 10,
      rateFromSession: overallConversion,
      dropOff: 46.7,
    },
  ];

  const deviceBreakdown: MetricRow[] = [
    { label: "Mobile", value: formatPercent(62.4, locale), barPercent: 100, secondary: "2.4% CR" },
    { label: "Desktop", value: formatPercent(31.2, locale), barPercent: 50, secondary: "3.6% CR" },
    { label: "Tablet", value: formatPercent(6.4, locale), barPercent: 10, secondary: "2.1% CR" },
  ];

  const checkoutDropOffSteps: MetricRow[] = [
    { label: "Address entry", value: formatPercent(12.4, locale), barPercent: 32, secondary: "Of checkout exits" },
    { label: "Shipping method", value: formatPercent(8.1, locale), barPercent: 21, secondary: "Of checkout exits" },
    { label: "Payment gateway", value: formatPercent(18.6, locale), barPercent: 49, secondary: "Highest drop-off" },
    { label: "Order review", value: formatPercent(6.2, locale), barPercent: 16, secondary: "Of checkout exits" },
  ];

  const paymentFailureBreakdown: MetricRow[] = [
    { label: "Insufficient funds", value: formatPercent(42, locale, 0), barPercent: 100 },
    { label: "Gateway timeout", value: formatPercent(28, locale, 0), barPercent: 67 },
    { label: "User cancelled", value: formatPercent(18, locale, 0), barPercent: 43 },
    { label: "Bank decline (other)", value: formatPercent(12, locale, 0), barPercent: 29 },
  ];

  return {
    period,
    periodDays: days,
    executiveKpis,
    topProductsByRevenue,
    marketingKpis,
    channelRevenueMix,
    cacByChannel,
    influencerMetrics,
    campaigns,
    productKpis,
    skuRevenueContribution,
    skuMarginContribution,
    inventoryStatus,
    customerKpis,
    firstPurchaseCategories,
    customerCohorts,
    funnelKpis,
    ecommerceFunnel,
    deviceBreakdown,
    checkoutDropOffSteps,
    paymentFailureBreakdown,
  };
}
