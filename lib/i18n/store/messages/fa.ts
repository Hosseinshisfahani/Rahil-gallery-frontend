import type { StoreMessages } from "./en";
import { contactPageFa } from "./contact-fa";
import { foundersPageFa } from "./founders-fa";
import { historyPageFa } from "./history-fa";
import { missionPageFa } from "./mission-fa";

export const storeMessagesFa = {
  meta: {
    title: "گالری راحیل — جواهرات فاخر",
    description:
      "جواهرات لوکس با روحی مدرن و رترو. کلکسیون‌ها، تازه‌ها و قطعات سفارشی از کارگاه اصفهان.",
  },
  landing: {
    hero: {
      eyebrow: "",
      titleLead: "هر انسان",
      titleAccent: "یک گوهر",
      body: "جواهراتی فاخر با داستانی متمایز که تنها یکبار و برای یک نفر ساخته میشوند.",
      exploreShop: "ورود به فروشگاه",
      designYours: "طراحی اختصاصی",
      footnote: "اصفهان, میدان نفش جهان,  بازار شیخ لطف الله قطعه ای ماندگار از دل تاریخ",
      imageAlt: "سولیتر ژوزفین اِگرت — مرجع شومه",
    },
    marquee: [
      "طلای ناب",
      "نشان‌کاری دستی",
      "ساخته‌شده به سفارش",
      "کارگاه اصفهان",
      "از ۲۰۲۴",
      "گالری راحیل",
    ],
    collections: {
      eyebrow: "کلکسیون‌ها",
      title: "هنرهای برگزیده",
      viewAll: "مشاهده همه",
      subtitles: {
        josephine: "گردنبندهای شاهانه",
        beeDeChaumet: "ترکیب مروارید",
        liens: "نمای داخلی",
      },
    },
    arrivals: {
      eyebrow: "تازه‌رسیده‌ها",
      title: "تازه از روی میز کار",
      shopAll: "همه محصولات",
      products: {
        silverTurquoiseRing: "انگشتر نقره و فیروزه",
        turquoiseGoldPendant: "آویز طلا و فیروزه",
        goldBlueStoneRing: "انگشتر طلا با سنگ آبی",
        turquoisePearlEarrings: "گوشواره فیروزه و مروارید",
      },
    },
    editorial: {
      eyebrow: "هنر اصیل",
      quote:
        "«میراثی از نسل‌ها، دانشی برای آینده.»",
      body: "داستان ما حدود هفت دهه پیش، در قلب بازار طلا و جواهر اصفهان آغاز شد؛ زمانی که پدر بزرگمان میرزا رضا فرحناکیان به همراه برادران، فعالیت خود را در عرصه طلا، نقره و جواهر در بازار زرگر های اصفهان آغاز کرد...",
      cta: "تاریخچه ما",
      imageAlt: "تصویر سردبیری جواهرات فاخر",
    },
    journal: {
      eyebrow: "مجله",
      title: "داستان‌هایی از کارگاه",
      posts: {
        goldAndLight: {
          title: "اعجاز طراحی",
          excerpt: "هر سنگ را برای رنگ و رگه‌اش کنار طلا می‌نشانیم تا قطعه آرام و یکدست بماند.",
          date: "مهر ۱۴۰۵",
        },
        stoneSelection: {
          title: "خلق ایده",
          excerpt: "از اتود روی کاغذ تا پرو در کارگاه؛ راهی که هر قطعه اختصاصی طی می‌کند.",
          date: "شهریور ۱۴۰۵",
        },
        atelierNotes: {
          title: "بهترین کیفیت",
          excerpt: "پس از ریخته‌گری، سوهان و پرداخت است که نور را روی اثر می‌نشاند.",
          date: "مرداد ۱۴۰۵",
        },
      },
    },
  },
  about: {
    stripTitle: "درباره ما",
    pending: "متن و تصویر این صفحه هنوز اضافه نشده است.",
    continueLabel: "ادامه",
    relatedLabel: "در این بخش",
    pages: {
      history: historyPageFa,
      founders: foundersPageFa,
      mission: missionPageFa,
      clients: {
        metaTitle: "مشتریان برتر — گالری راحیل",
        metaDescription: "میهمانان و مشتریان گالری راحیل.",
        title: "مشتریان برتر",
        collageAlt: "کلاژ سه عکس",
      },
      contact: contactPageFa,
    },
  },
} satisfies StoreMessages;
