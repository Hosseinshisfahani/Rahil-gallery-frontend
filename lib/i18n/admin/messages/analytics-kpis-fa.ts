/** Analytics KPI label/change strings — Persian */
export const analyticsKpisFa = {
  executive: {
    kpis: {
      netRevenue: { label: "درآمد خالص", change: "+۸.۴٪ نسبت به ۳۰ روز قبل" },
      orders: { label: "سفارش‌ها", change: "+۱۲٪ نسبت به ۳۰ روز قبل" },
      conversionRate: { label: "نرخ تبدیل", change: "+۰.۳ واحد نسبت به ۳۰ روز قبل" },
      aov: { label: "میانگین ارزش سفارش", change: "+۴.۱٪ نسبت به ۳۰ روز قبل" },
      cac: { label: "CAC", change: "−۶٪ نسبت به ۳۰ روز قبل" },
      ltv: { label: "LTV", change: "+۲.۱٪ نسبت به ۳۰ روز قبل" },
      ltvCac: { label: "نسبت LTV:CAC", change: "هدف > ۳× · سالم" },
      grossMargin: { label: "حاشیه ناخالص", change: "+۰.۸ واحد نسبت به ۳۰ روز قبل" },
      returnRate: { label: "نرخ مرجوعی", change: "−۰.۴ واحد نسبت به ۳۰ روز قبل" },
      roasBlended: { label: "ROAS (ترکیبی)", change: "+۰.۵× نسبت به ۳۰ روز قبل" },
    },
  },
  marketing: {
    kpis: {
      blendedRoas: { label: "ROAS ترکیبی", change: "پولی + شبکه‌های اجتماعی" },
      totalAdSpend: { label: "کل هزینه تبلیغ", change: "+۵٪ نسبت به ۳۰ روز قبل" },
      emailRevenueShare: { label: "سهم درآمد ایمیل", change: "+۱.۱ واحد نسبت به ۳۰ روز قبل" },
      organicRevenueShare: { label: "سهم درآمد ارگانیک", change: "پایدار" },
    },
  },
  product: {
    kpis: {
      viewToCart: { label: "مشاهده → افزودن به سبد", change: "+۰.۶ واحد نسبت به ۳۰ روز قبل" },
      cartToPurchase: { label: "سبد → خرید", change: "−۰.۲ واحد نسبت به ۳۰ روز قبل" },
      inventoryTurnover: { label: "گردش موجودی", change: "سالانه · میانگین جواهر ۳–۵×" },
      stockoutRate: { label: "نرخ اتمام موجودی", change: "۴ SKU تحت تأثیر" },
    },
  },
  customer: {
    kpis: {
      ltv: { label: "ارزش طول عمر (LTV)", change: "+۲.۱٪ نسبت به ۳۰ روز قبل" },
      repeatRate: { label: "نرخ خرید مجدد", change: "+۱.۸ واحد نسبت به ۳۰ روز قبل" },
      avgTimeBetween: { label: "میانگین فاصله خرید", change: "هدایا و مناسبت‌ها" },
      wishlistRate: { label: "نرخ علاقه‌مندی", change: "نشست‌های افزودن به علاقه‌مندی" },
      cartAbandonment: { label: "رها کردن سبد", change: "−۱.۴ واحد نسبت به ۳۰ روز قبل" },
    },
  },
  funnel: {
    kpis: {
      productViewRate: { label: "نرخ مشاهده محصول", change: "نشست‌های با ≥۱ صفحه محصول" },
      cartConversion: { label: "تبدیل سبد", change: "مشاهده محصول → افزودن به سبد" },
      overallConversion: { label: "تبدیل کلی", change: "نشست → خرید" },
      checkoutDropOff: { label: "ریزش پرداخت", change: "سبد → رها کردن پرداخت" },
      paymentFailureRate: { label: "نرخ خطای پرداخت", change: "رد درگاه + timeout" },
    },
  },
} as const;
