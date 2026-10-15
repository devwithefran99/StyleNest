/* ==========================================================================
   SITE CONFIG
   Notun client er jonno shudhu ei file ta bodlaben. Baki file ghatar dorkar nai.

   Quick checklist:
   1. brand.name / brand.logo / brand.tagline
   2. theme.accent (button er rong)
   3. contact.whatsapp (country code shoho, + chara. e.g. 8801XXXXXXXXX)
   4. products (img: product er photo path), collections
   5. hero.image, social links, footer, copy (headline text)
   ========================================================================== */

window.SITE = {

  /* ---------- Brand ---------- */
  brand: {
    name: "StyleNest",
    tagline: "Made in Bangladesh",
    logo: "",          // e.g. "assets/logo.png". Khali thakle naam text hishebe dekhabe
    logoHeight: 28,    // px
    favicon: ""        // e.g. "assets/favicon.png". Khali thakle auto generate hobe
  },

  /* ---------- Look ---------- */
  theme: {
    accent: "#111111"  // button ar active filter er rong (hex). Page background shobsomoy white
  },

  seo: {
    title: "StyleNest | Everyday clothing made in Bangladesh",
    description: "Shirts, trousers, winter wear and festive panjabi. Cash on delivery all over Bangladesh."
  },

  /* Upore ekta chhoto black bar. Khali ("") rakhle dekhabe na */
  announcement: "Cash on delivery all over Bangladesh. Trial at delivery.",

  /* ---------- Contact ---------- */
  contact: {
    whatsapp: "8801700000000",      // sudhu digit, country code shoho
    phone: "+8801700000000",
    email: "hello@yourbrand.com",
    messenger: "",                  // Facebook page username (m.me/<username>)
    address: "Chattogram, Bangladesh"
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "",
    tiktok: ""
  },

  currency: "৳",

  /* WhatsApp order message. Placeholders: {brand} {product} {size} {price} {url} */
  orderMessage: "Hello {brand}, I would like to order:\n\nProduct: {product}\nSize: {size}\nPrice: {price}\n\n{url}",

  defaultDescription: "Soft, durable fabric with a clean fit. Cut and stitched in Bangladesh.",

  /* ---------- Navigation ---------- */
  nav: [
    { label: "Collections", href: "#collections" },
    { label: "Shop",        href: "#shop" },
    { label: "Why us",      href: "#perks" },
    { label: "Contact",     href: "#contact" }
  ],

  /* ---------- Hero ---------- */
  hero: {
    eyebrow: "Winter 2026 collection",
    title: "Everyday clothing, made in Bangladesh",
    text: "Clean cuts, honest fabric and fair prices. Pick a piece, message us, and pay when it reaches your door.",
    image: "assets/hero.svg",          // photo/banner. Pore real photo diye replace korben
    primary:   { label: "Shop now", href: "#shop" },
    secondary: { label: "Order on WhatsApp", href: "whatsapp" },   // "whatsapp" likhle auto link hobe
    points: [
      { icon: "bi-cash-coin",    text: "Cash on delivery" },
      { icon: "bi-box-seam",     text: "Trial at delivery" },
      { icon: "bi-arrow-repeat", text: "Easy exchange" }
    ]
  },

  /* ---------- Section copy ---------- */
  copy: {
    collections: { title: "Shop by category" },
    shop:        { title: "All products", text: "Tap a piece to pick a size and order on WhatsApp." },
    perks:       { title: "Shopping without the risk" },
    reviews:     { title: "What customers say" },
    cta: {
      title: "Found something you like?",
      text: "Message us with the product name and size. We confirm your order and deliver to your door."
    }
  },

  /* ---------- Collections ----------
     img khali rakhle oi category r prothom product er photo dekhabe
  */
  collections: [
    { id: "shirts",  name: "Shirts",  img: "" },
    { id: "bottoms", name: "Bottoms", img: "" },
    { id: "winter",  name: "Winter",  img: "" },
    { id: "festive", name: "Festive", img: "" }
  ],

  /* ---------- Products ----------
     img:   "assets/products/xyz.jpg"   (ekhon dummy SVG ache, real photo diye replace korben)
     badge: "NEW" | "SALE"              (optional)
     sizes: ["S","M","L"]               (optional, default S-XXL)
     desc:  "..."                       (optional)
  */
  products: [
    { id: "crochet-ivory",  name: "Crochet Cuban Shirt, Ivory",       category: "shirts",  price: 1250, badge: "NEW", img: "assets/products/crochet-ivory.svg",
      desc: "Textured crochet knit with a Cuban collar and a relaxed boxy cut. Light enough for warm afternoons." },
    { id: "organza-royal",  name: "Organza Safari Shirt, Royal Blue", category: "shirts",  price: 1250, badge: "NEW", img: "assets/products/organza-royal.svg" },
    { id: "organza-navy",   name: "Organza Shirt, Rich Navy",         category: "shirts",  price: 1150, img: "assets/products/organza-navy.svg" },
    { id: "plaid-wine",     name: "Plaid Flannel Shirt, Wine",        category: "shirts",  price: 1350, img: "assets/products/plaid-wine.svg" },

    { id: "pleat-charcoal", name: "Pleated Trousers, Charcoal",       category: "bottoms", price: 1450, img: "assets/products/pleat-charcoal.svg" },
    { id: "pleat-cream",    name: "Pleated Trousers, Cream",          category: "bottoms", price: 1450, img: "assets/products/pleat-cream.svg" },
    { id: "pleat-navy",     name: "Pleated Trousers, Classic Navy",   category: "bottoms", price: 1450, img: "assets/products/pleat-navy.svg" },
    { id: "painter-olive",  name: "Painter Pants, Olive",             category: "bottoms", price: 1650, img: "assets/products/painter-olive.svg" },

    { id: "sherpa-brown",   name: "Sherpa Jacket, Brown",             category: "winter",  price: 3250, oldPrice: 3850, badge: "SALE", img: "assets/products/sherpa-brown.svg" },
    { id: "turtle-forest",  name: "Turtleneck Sweater, Forest",       category: "winter",  price: 2150, img: "assets/products/turtle-forest.svg" },
    { id: "cord-taupe",     name: "Cord Overshirt, Taupe",            category: "winter",  price: 2450, img: "assets/products/cord-taupe.svg" },
    { id: "zip-slate",      name: "Zipped Knit Jacket, Slate",        category: "winter",  price: 2950, img: "assets/products/zip-slate.svg" },

    { id: "panjabi-black",  name: "Zardozi Panjabi, Black",           category: "festive", price: 2350, oldPrice: 2790, badge: "SALE", img: "assets/products/panjabi-black.svg" },
    { id: "panjabi-olive",  name: "Zardozi Panjabi, Olive",           category: "festive", price: 2350, oldPrice: 2790, badge: "SALE", img: "assets/products/panjabi-olive.svg" },
    { id: "panjabi-gold",   name: "Zardozi Panjabi, Mustard",         category: "festive", price: 2050, oldPrice: 2490, badge: "SALE", img: "assets/products/panjabi-gold.svg" },
    { id: "panjabi-brown",  name: "Zardozi Panjabi, Brown",           category: "festive", price: 2350, img: "assets/products/panjabi-brown.svg" }
  ],

  /* ---------- Perks ---------- */
  perks: [
    { icon: "bi-cash-coin",    title: "Cash on delivery",   text: "Pay at your door, anywhere in Bangladesh." },
    { icon: "bi-box-seam",     title: "Trial at delivery",  text: "Try it on while the rider waits." },
    { icon: "bi-arrow-repeat", title: "Easy exchange",      text: "Wrong size? We swap it, no questions." },
    { icon: "bi-patch-check",  title: "Made in Bangladesh", text: "Cut and stitched by local workshops." }
  ],

  /* ---------- Reviews ----------
     Sudhu real customer review boshaben. enabled: true korle section ta dekhabe.
  */
  testimonials: {
    enabled: false,
    items: [
      // { name: "Customer name", place: "Dhaka", rating: 5, text: "Real review here." }
    ]
  },

  /* ---------- Footer ---------- */
  footer: {
    about: "Everyday clothing made in Bangladesh. Honest fabric, clean cuts, cash on delivery.",
    help: [
      { label: "Delivery policy",    href: "#" },
      { label: "Exchange policy",    href: "#" },
      { label: "Privacy policy",     href: "#" },
      { label: "Terms & conditions", href: "#" }
    ]
  }
};
