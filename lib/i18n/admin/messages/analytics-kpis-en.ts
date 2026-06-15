/** Analytics KPI label/change strings — merged into en-extra */
export const analyticsKpisEn = {
  executive: {
    kpis: {
      netRevenue: { label: "Net revenue", change: "+8.4% vs prior 30d" },
      orders: { label: "Orders", change: "+12% vs prior 30d" },
      conversionRate: { label: "Conversion rate", change: "+0.3pp vs prior 30d" },
      aov: { label: "Average order value", change: "+4.1% vs prior 30d" },
      cac: { label: "CAC", change: "−6% vs prior 30d" },
      ltv: { label: "LTV", change: "+2.1% vs prior 30d" },
      ltvCac: { label: "LTV:CAC ratio", change: "Target > 3× · healthy" },
      grossMargin: { label: "Gross margin", change: "+0.8pp vs prior 30d" },
      returnRate: { label: "Return rate", change: "−0.4pp vs prior 30d" },
      roasBlended: { label: "ROAS (blended)", change: "+0.5× vs prior 30d" },
    },
  },
  marketing: {
    kpis: {
      blendedRoas: { label: "Blended ROAS", change: "Paid + social combined" },
      totalAdSpend: { label: "Total ad spend", change: "+5% vs prior 30d" },
      emailRevenueShare: { label: "Email revenue share", change: "+1.1pp vs prior 30d" },
      organicRevenueShare: { label: "Organic revenue share", change: "Stable" },
    },
  },
  product: {
    kpis: {
      viewToCart: { label: "View → add-to-cart", change: "+0.6pp vs prior 30d" },
      cartToPurchase: { label: "Cart → purchase", change: "−0.2pp vs prior 30d" },
      inventoryTurnover: { label: "Inventory turnover", change: "Annualized · jewelry avg 3–5×" },
      stockoutRate: { label: "Stockout rate", change: "4 SKUs affected" },
    },
  },
  customer: {
    kpis: {
      ltv: { label: "Lifetime value (LTV)", change: "+2.1% vs prior 30d" },
      repeatRate: { label: "Repeat purchase rate", change: "+1.8pp vs prior 30d" },
      avgTimeBetween: { label: "Avg. time between purchases", change: "Gift & occasion driven" },
      wishlistRate: { label: "Wishlist rate", change: "Sessions adding to wishlist" },
      cartAbandonment: { label: "Cart abandonment", change: "−1.4pp vs prior 30d" },
    },
  },
  funnel: {
    kpis: {
      productViewRate: { label: "Product view rate", change: "Sessions viewing ≥1 PDP" },
      cartConversion: { label: "Cart conversion", change: "PDP view → add to cart" },
      overallConversion: { label: "Overall conversion", change: "Sessions → purchase" },
      checkoutDropOff: { label: "Checkout drop-off", change: "Cart → abandoned checkout" },
      paymentFailureRate: { label: "Payment failure rate", change: "Gateway declines + timeouts" },
    },
  },
} as const;
