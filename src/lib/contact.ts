// منبع دادهٔ فرانت برای اطلاعات تماس و لینک‌ها
export const CONTACT = {
  brand: "Wircino",
  slogan: "همه‌چیز برای سلامت و شادی پت",
  addressLines: [
    "کردستان، سنندج",
  ],

  phone: { raw: "+982100000000", label: "۰۲۱-۰۰۰۰۰۰۰۰" },
  whatsapp: { raw: "+989000000000", label: "واتس‌اپ پشتیبانی" },
  email: "support@wircino.com",
  workHours: "شنبه تا پنجشنبه: ۹ تا ۱۸",
  socials: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
    x: "https://x.com/",
    whatsapp: "https://wa.me/989123456789" // شماره با فرمت بین‌المللی

  },
  nav: {
    shop: "/shop",
    blog: "/blog",
    contact: "/contact",
    brands: "/brands",
    offers: "/offers",
    faq: "/support/faq",
    shipping: "/support/shipping",
    returns: "/support/returns",
  },
  legal: {
    terms: "/terms",
    privacy: "/privacy",
    returns: "/returns",
  },
} as const;
