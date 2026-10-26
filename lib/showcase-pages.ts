import type { Locale } from "@/lib/types";

export type ShowcaseItem = {
  title: string;
  description: string;
  items?: readonly string[];
  image?: string;
};

type ShowcaseCopy = {
  categories: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    indexLabel: string;
    groupsLabel: string;
    groupsTitle: string;
    groups: readonly ShowcaseItem[];
    jewelryLabel: string;
    jewelryTitle: string;
    jewelryIntro: string;
    jewelryTypes: readonly string[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaBody: string;
    ctaLabel: string;
  };
  services: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    indexLabel: string;
    servicesLabel: string;
    servicesTitle: string;
    items: readonly ShowcaseItem[];
    processLabel: string;
    processTitle: string;
    process: readonly { title: string; body: string }[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaBody: string;
    ctaLabel: string;
  };
};

const fa: ShowcaseCopy = {
  categories: {
    metaTitle: "دسته‌بندی محصولات — گالری راحیل",
    metaDescription:
      "گوهرسنگ‌های قیمتی و نیمه‌قیمتی، زیورآلات ترکیبی با سنگ و هدایای سنگی گالری راحیل.",
    eyebrow: "گنجینه راحیل",
    title: "هر سنگ، آغاز یک داستان",
    intro:
      "مجموعه‌ای انتخاب‌شده از گوهرسنگ‌ها، زیورآلات و هدایای هنری؛ از نمونه‌های کمیاب کلکسیونی تا آثاری که برای یک نفر ساخته می‌شوند.",
    indexLabel: "راهنمای مجموعه",
    groupsLabel: "دسته‌بندی محصولات",
    groupsTitle: "سه جهان، یک زبان مشترک",
    groups: [
      {
        title: "گوهرسنگ‌ها",
        description:
          "گزیده‌ای کارشناسی‌شده از سنگ‌های طبیعی با اصالت، رنگ و شخصیت منحصربه‌فرد.",
        items: [
          "گوهرسنگ‌های قیمتی",
          "گوهرسنگ‌های نیمه‌قیمتی",
          "گوهرسنگ‌های کمیاب و کلکسیونی",
          "بندهای سنگی",
        ],
        image: "/landing/silver-turquoise-ring.webp",
      },
      {
        title: "زیورآلات ترکیبی با سنگ",
        description:
          "پیوند هنر دست، فلزات ارزشمند و گوهرهایی که برای هر طراحی به‌دقت انتخاب می‌شوند.",
        items: ["طلا و گوهرسنگ‌ها", "نقره و گوهرسنگ‌ها"],
        image: "/landing/turquoise-gold-pendant.webp",
      },
      {
        title: "هدایای ترکیبی با سنگ",
        description:
          "هدایایی شخصی و ماندگار که معنا، زیبایی و طبیعت را در یک اثر جمع می‌کنند.",
        image: "/landing/turquoise-pearl-earrings-v2.webp",
      },
    ],
    jewelryLabel: "فرم و کاربرد",
    jewelryTitle: "انواع زیورها",
    jewelryIntro:
      "از ظریف‌ترین جزئیات تا قطعات شاخص؛ هر فرم می‌تواند متناسب با سنگ، فلز و داستان شما بازطراحی شود.",
    jewelryTypes: [
      "تاج و نیم‌تاج",
      "سنجاق سر و حلقهٔ مو",
      "گوشواره و گوش‌بند",
      "گردنبند، مدال و تورک",
      "زنجیر",
      "ست کامل و نیم‌ست",
      "بازوبند",
      "دستبند، بنگل، النگو و مچ‌بند",
      "حلقه و انگشتر",
      "ساعت",
      "کمربند",
      "خلخال و پابند",
      "انواع زنجیرها",
      "گل سینه و سنجاق سینه",
      "دکمهٔ سرآستین",
      "گیرهٔ کراوات",
    ],
    ctaEyebrow: "ساخته‌شده برای شما",
    ctaTitle: "گوهر خود را پیدا کنید",
    ctaBody:
      "برای انتخاب سنگ، سفارش طراحی اختصاصی یا دریافت مشاوره با کارشناسان گالری راحیل گفت‌وگو کنید.",
    ctaLabel: "درخواست مشاوره",
  },
  services: {
    metaTitle: "خدمات — گالری راحیل",
    metaDescription:
      "خدمات پژوهشی، آموزشی، تجاری، تولید گوهرسنگ و طراحی زیورآلات و هدایای ترکیبی با سنگ.",
    eyebrow: "دانش، هنر، تجارت",
    title: "از شناخت گوهر تا خلق اثر",
    intro:
      "راحیل در تمام مسیر گوهر همراه شماست؛ از پژوهش و تأمین حرفه‌ای تا طراحی و ساخت اثری که هویت شما را بازتاب می‌دهد.",
    indexLabel: "حوزه‌های تخصص",
    servicesLabel: "خدمات راحیل",
    servicesTitle: "پنج مسیر تخصصی، یک استاندارد",
    items: [
      {
        title: "پژوهش و آموزش‌های علمی جواهرشناسی و گوهرسنگ‌ها",
        description:
          "انتقال دانش کاربردی و به‌روز برای شناخت علمی، ارزیابی و انتخاب آگاهانهٔ گوهرسنگ‌ها.",
        image: "/landing/journal-blue-pendant.webp",
      },
      {
        title: "خدمات تجاری و بازرگانی حوزهٔ جواهرسنگ‌ها",
        description:
          "همراهی تخصصی در شناسایی فرصت‌ها، تأمین، توسعهٔ بازار و ایجاد ارتباطات معتبر تجاری.",
        image: "/landing/rahil-gallery-front.jpg",
      },
      {
        title: "تولید و توزیع سنگ‌های قیمتی و نیمه‌قیمتی",
        description:
          "تأمین و عرضهٔ گزیده‌ای از سنگ‌های طبیعی با تمرکز بر کیفیت، اصالت و قابلیت رهگیری.",
        image: "/landing/silver-pearl-ring-v3.webp",
      },
      {
        title: "طراحی و ساخت انواع زیورآلات ترکیبی با سنگ",
        description:
          "تبدیل ایده به زیوری منحصربه‌فرد با تلفیق طراحی معاصر، هنر دست و انتخاب دقیق سنگ.",
        image: "/landing/gold-blue-stone-ring.webp",
      },
      {
        title: "طراحی و تولید هدایای ترکیبی با سنگ",
        description:
          "خلق هدایای شخصی یا سازمانی که با ترکیب سنگ، روایت و طراحی اختصاصی ماندگار می‌شوند.",
        image: "/landing/journal-turquoise-crown.webp",
      },
    ],
    processLabel: "شیوه همکاری",
    processTitle: "مسیر روشن از ایده تا نتیجه",
    process: [
      {
        title: "گفت‌وگو و نیازسنجی",
        body: "هدف، بودجه، زمان و انتظارات شما را با دقت بررسی می‌کنیم.",
      },
      {
        title: "پیشنهاد تخصصی",
        body: "بهترین مسیر، متریال و راهکار اجرایی به‌صورت شفاف ارائه می‌شود.",
      },
      {
        title: "اجرا و همراهی",
        body: "فرایند با کنترل کیفیت و ارتباط مستمر تا تحویل نهایی پیش می‌رود.",
      },
    ],
    ctaEyebrow: "آغاز یک همکاری",
    ctaTitle: "دربارهٔ پروژه‌تان با ما صحبت کنید",
    ctaBody:
      "تیم راحیل آماده است تا نیاز پژوهشی، تجاری یا طراحی شما را به یک مسیر اجرایی دقیق تبدیل کند.",
    ctaLabel: "تماس با راحیل",
  },
};

const en: ShowcaseCopy = {
  categories: {
    metaTitle: "Product Categories — Rahil Gallery",
    metaDescription:
      "Precious and semi-precious gemstones, stone-set jewelry, and distinctive stone gifts by Rahil Gallery.",
    eyebrow: "The Rahil treasury",
    title: "Every stone begins a story",
    intro:
      "A considered collection of gemstones, jewelry, and artful gifts—from rare collector specimens to pieces created for one person alone.",
    indexLabel: "Collection guide",
    groupsLabel: "Product categories",
    groupsTitle: "Three worlds, one language",
    groups: [
      {
        title: "Gemstones",
        description:
          "Expertly selected natural stones, each with a singular provenance, color, and character.",
        items: [
          "Precious gemstones",
          "Semi-precious gemstones",
          "Rare and collectible gemstones",
          "Stone strands",
        ],
        image: "/landing/silver-turquoise-ring.webp",
      },
      {
        title: "Stone-set jewelry",
        description:
          "The meeting of handcraft, precious metals, and gemstones chosen specifically for each design.",
        items: ["Gold and gemstones", "Silver and gemstones"],
        image: "/landing/turquoise-gold-pendant.webp",
      },
      {
        title: "Stone-composed gifts",
        description:
          "Personal, enduring gifts that bring meaning, beauty, and the natural world into one object.",
        image: "/landing/turquoise-pearl-earrings-v2.webp",
      },
    ],
    jewelryLabel: "Form & function",
    jewelryTitle: "Jewelry types",
    jewelryIntro:
      "From the finest detail to a statement piece, every form can be reimagined around your stone, metal, and story.",
    jewelryTypes: [
      "Tiaras and half-tiaras",
      "Hair pins and hair rings",
      "Earrings and ear cuffs",
      "Necklaces, pendants, and torcs",
      "Chains",
      "Full and demi-parures",
      "Armlets",
      "Bracelets, bangles, and wristlets",
      "Bands and rings",
      "Watches",
      "Belts",
      "Anklets",
      "Specialty chains",
      "Brooches and pins",
      "Cufflinks",
      "Tie clips",
    ],
    ctaEyebrow: "Made for you",
    ctaTitle: "Find your stone",
    ctaBody:
      "Speak with Rahil Gallery’s specialists for stone selection, bespoke commissions, or expert guidance.",
    ctaLabel: "Request a consultation",
  },
  services: {
    metaTitle: "Services — Rahil Gallery",
    metaDescription:
      "Gemological research, education, trade, gemstone production, jewelry design, and stone-composed gifts.",
    eyebrow: "Knowledge, craft, commerce",
    title: "From knowing the gem to creating the piece",
    intro:
      "Rahil accompanies the entire gemstone journey—from research and professional sourcing to the design and making of an object that reflects you.",
    indexLabel: "Areas of expertise",
    servicesLabel: "Rahil services",
    servicesTitle: "Five disciplines, one standard",
    items: [
      {
        title: "Gemology and gemstone research & education",
        description:
          "Current, practical knowledge for scientific identification, evaluation, and informed gemstone selection.",
        image: "/landing/journal-blue-pendant.webp",
      },
      {
        title: "Gemstone trade and commercial services",
        description:
          "Specialist support in opportunity discovery, sourcing, market development, and trusted trade relationships.",
        image: "/landing/rahil-gallery-front.jpg",
      },
      {
        title: "Precious and semi-precious stone production & distribution",
        description:
          "A considered supply of natural stones with a focus on quality, authenticity, and traceability.",
        image: "/landing/silver-pearl-ring-v3.webp",
      },
      {
        title: "Design and creation of stone-set jewelry",
        description:
          "Turning ideas into singular jewelry through contemporary design, handcraft, and precise stone selection.",
        image: "/landing/gold-blue-stone-ring.webp",
      },
      {
        title: "Design and production of stone-composed gifts",
        description:
          "Personal and corporate gifts made memorable through stone, narrative, and commissioned design.",
        image: "/landing/journal-turquoise-crown.webp",
      },
    ],
    processLabel: "How we work",
    processTitle: "A clear path from idea to outcome",
    process: [
      {
        title: "Discovery",
        body: "We carefully map your goal, budget, timeframe, and expectations.",
      },
      {
        title: "Expert proposal",
        body: "The right approach, materials, and delivery plan are presented transparently.",
      },
      {
        title: "Delivery & care",
        body: "Quality control and close communication continue through final delivery.",
      },
    ],
    ctaEyebrow: "Begin a collaboration",
    ctaTitle: "Tell us about your project",
    ctaBody:
      "The Rahil team can turn your research, commercial, or design need into a precise path to delivery.",
    ctaLabel: "Contact Rahil",
  },
};

export function getShowcaseCopy(locale: Locale) {
  return locale === "fa" ? fa : en;
}
