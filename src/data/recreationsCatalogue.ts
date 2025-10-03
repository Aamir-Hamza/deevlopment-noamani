export type Product = {
  slug: string;
  name: string;
  brand: string;
  inStock: boolean;
  price: number;
  images: string[];
  fragrances: string[];
};

export const recreationsCatalogue: Product[] = [
  // Armani
  { slug: "my-way-armani", name: "My Way Armani", brand: "Armani", inStock: true, price: 99, images: ["/product-images/1750533472310-780636131-logo.png", "/product-images/1751275737185-760089634-newproduct.png", "/product-images/1751275756684-255939841-planebox-remove.png"], fragrances: ["My Way Armani Intense", "My Way Armani Classic"] },
  { slug: "because-its-you", name: "Because It's You", brand: "Armani", inStock: false, price: 99, images: ["/product-images/1751276321591-896069559-newproduct-removebg-preview.png", "/product-images/1751276461471-391309699-newproduct-removebg-preview.png", "/product-images/1751277340230-631676697-productnew-removebg-preview.png"], fragrances: ["Because It's You Intense", "Because It's You Eau de Parfum"] },
  { slug: "red-armani", name: "Red", brand: "Armani", inStock: true, price: 99, images: ["/product-images/1750533472310-780636131-logo.png", "/product-images/1751275737185-760089634-newproduct.png", "/product-images/1751275756684-255939841-planebox-remove.png"], fragrances: ["Red Intense", "Red Classic"] },
  { slug: "aqua-di-gio", name: "Aqua Di Gio", brand: "Armani", inStock: true, price: 99, images: ["/product-images/1750533472310-780636131-logo.png", "/product-images/1751275737185-760089634-newproduct.png", "/product-images/1751275756684-255939841-planebox-remove.png"], fragrances: ["Aqua Di Gio Eau de Parfum", "Aqua Di Gio Profumo"] },
  { slug: "aqua-di-gio-profumo", name: "Aqua Di Gio Profumo", brand: "Armani", inStock: true, price: 99, images: ["/product-images/1750533472310-780636131-logo.png", "/product-images/1751275737185-760089634-newproduct.png", "/product-images/1751275756684-255939841-planebox-remove.png"], fragrances: ["Aqua Di Gio Profumo"] },
  { slug: "attitude-attitude-extreme", name: "Attitude, Attitude Extreme", brand: "Armani", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Attitude", "Attitude Extreme"] },
  { slug: "armani-si-si-passione-si-intense", name: "Armani Si, Si Passione, Si Intense", brand: "Armani", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Si", "Si Passione", "Si Intense"] },
  { slug: "armani-code-variants", name: "Armani Code variants (A-List, Absolu, Colonia, etc.)", brand: "Armani", inStock: false, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["A-List", "Absolu", "Colonia"] },
  { slug: "emporio-armani-he-stronger", name: "Emporio Armani: He, Stronger With You (and flankers)", brand: "Armani", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["He", "Stronger With You"] },
  { slug: "acqua-di-gioia-air-di-gioia", name: "Acqua di Gioia, Air di Gioia", brand: "Armani", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Acqua di Gioia", "Air di Gioia"] },

  // Burberry
  { slug: "goddess", name: "Goddess", brand: "Burberry", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Goddess"] },
  { slug: "weekend-women", name: "Weekend (Women)", brand: "Burberry", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Weekend (Women)"] },
  { slug: "her", name: "Her", brand: "Burberry", inStock: false, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Her"] },
  { slug: "weekend-men", name: "Weekend (Men)", brand: "Burberry", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Weekend (Men)"] },
  { slug: "burberry-brit", name: "Burberry Brit", brand: "Burberry", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Burberry Brit"] },
  { slug: "mr-burberry-indigo", name: "Mr. Burberry (Indigo, Extreme, Parfum)", brand: "Burberry", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Indigo", "Extreme", "Parfum"] },
  { slug: "my-burberry-black-edt", name: "My Burberry (Black, Eau de Toilette)", brand: "Burberry", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Black", "Eau de Toilette"] },

  // Tom Ford
  { slug: "oud-wood", name: "Oud Wood", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Oud Wood"] },
  { slug: "tobacco-oud", name: "Tobacco Oud", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Tobacco Oud"] },
  { slug: "tuscan-leather", name: "Tuscan Leather", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Tuscan Leather"] },
  { slug: "ombre-leather", name: "Ombre Leather", brand: "Tom Ford", inStock: false, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Ombre Leather"] },
  { slug: "tobacco-vanilla", name: "Tobacco Vanilla", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Tobacco Vanilla"] },
  { slug: "lost-cherry", name: "Lost Cherry", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Lost Cherry"] },
  { slug: "fucking-fabulous", name: "Fucking Fabulous", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Fucking Fabulous"] },
  { slug: "black-orchid", name: "Black Orchid", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Black Orchid"] },
  { slug: "noir-extreme-noir-de-noir", name: "Noir Extreme, Noir de Noir", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Noir Extreme", "Noir de Noir"] },
  { slug: "rose-prick", name: "Rose Prick", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Rose Prick"] },
  { slug: "champaca-absolute", name: "Champaca Absolute", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Champaca Absolute"] },
  { slug: "soleil-blanc", name: "Soleil Blanc", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Soleil Blanc"] },
  { slug: "amber-absolute", name: "Amber Absolute", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Amber Absolute"] },
  { slug: "plum-japonais", name: "Plum Japonais", brand: "Tom Ford", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Plum Japonais"] },

  // Dior
  { slug: "oud-rosewood", name: "Oud Rosewood", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Oud Rosewood"] },
  { slug: "jadore", name: "Jadore", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Jadore"] },
  { slug: "miss-dior-cherie", name: "Miss Dior Cherie", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Miss Dior Cherie"] },
  { slug: "sauvage", name: "Sauvage", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Sauvage"] },
  { slug: "sauvage-silk", name: "Sauvage SILK", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Sauvage SILK"] },
  { slug: "homme-sports", name: "Homme Sports", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Homme Sports"] },
  { slug: "miss-dior-flankers", name: "Miss Dior flankers (Chère, Bloom)", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Chère", "Bloom"] },
  { slug: "dior-homme-intense-parfum-cologne", name: "Dior Homme Intense/Parfum/Cologne", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Intense", "Parfum", "Cologne"] },
  { slug: "sauvage-elixir-parfum-eau-forte", name: "Sauvage Elixir, Parfum, Eau Forte", brand: "Dior", inStock: false, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Elixir", "Parfum", "Eau Forte"] },
  { slug: "jadore-lor", name: "J'adore L'Or", brand: "Dior", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["J'adore L'Or"] },

  // Jo Malone
  { slug: "oud-bergamot", name: "Oud & Bergamot", brand: "Jo Malone", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Oud & Bergamot"] },
  { slug: "english-pear-freesia", name: "English Pear & Freesia", brand: "Jo Malone", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["English Pear & Freesia"] },
  { slug: "lime-basil-mandarin", name: "Lime Basil & Mandarin", brand: "Jo Malone", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Lime Basil & Mandarin"] },
  { slug: "peony-blush-suede", name: "Peony & Blush Suede", brand: "Jo Malone", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Peony & Blush Suede"] },
  { slug: "red-roses-wood-sage-sea-salt", name: "Red Roses, Wood Sage & Sea Salt", brand: "Jo Malone", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Red Roses", "Wood Sage & Sea Salt"] },
  { slug: "nectarine-blossom-honey", name: "Nectarine Blossom & Honey", brand: "Jo Malone", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Nectarine Blossom & Honey"] },

  // Gucci
  { slug: "flora", name: "Flora", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Flora"] },
  { slug: "bamboo", name: "Bamboo", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Bamboo"] },
  { slug: "bloom", name: "Bloom", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Bloom"] },
  { slug: "guilty", name: "Guilty", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Guilty"] },
  { slug: "gucci-by-gucci", name: "Gucci by Gucci (Pour Homme & Women)", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Pour Homme", "Women"] },
  { slug: "envy", name: "Envy", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Envy"] },
  { slug: "rush", name: "Rush", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Rush"] },
  { slug: "gucci-premiere", name: "Gucci Première", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Gucci Première"] },
  { slug: "guilty-absolute", name: "Guilty Absolute", brand: "Gucci", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Guilty Absolute"] },

  // YSL
  { slug: "baby-doll", name: "Baby Doll", brand: "YSL", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Baby Doll"] },
  { slug: "y", name: "Y", brand: "YSL", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Y"] },
  { slug: "lhomme", name: "L'Homme (Parfum, Intense)", brand: "YSL", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Parfum", "Intense"] },
  { slug: "opium", name: "Opium", brand: "YSL", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Opium"] },
  { slug: "libre", name: "Libre", brand: "YSL", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Libre"] },
  { slug: "black-opium", name: "Black Opium", brand: "YSL", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Black Opium"] },

  // Chanel
  { slug: "no-5", name: "No. 5", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["No. 5"] },
  { slug: "allure-homme-sport", name: "Allure Homme Sport", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Allure Homme Sport"] },
  { slug: "bleu-de-chanel", name: "Bleu de Chanel", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Bleu de Chanel"] },
  { slug: "coco-mademoiselle", name: "Coco Mademoiselle", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Coco Mademoiselle"] },
  { slug: "chance", name: "Chance", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Chance"] },
  { slug: "platinum-egoiste", name: "Platinum Égoïste", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Platinum Égoïste"] },
  { slug: "coromandel", name: "Coromandel", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Coromandel"] },
  { slug: "le-lion", name: "Le Lion", brand: "Chanel", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Le Lion"] },

  // Maison Francis Kurkdjian
  { slug: "grand-soir", name: "Grand Soir", brand: "Maison Francis Kurkdjian", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Grand Soir"] },
  { slug: "baccarat-rouge-540", name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Baccarat Rouge 540"] },
  { slug: "aqua-universalis", name: "Aqua Universalis", brand: "Maison Francis Kurkdjian", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Aqua Universalis"] },
  { slug: "aqua-vitae", name: "Aqua Vitae", brand: "Maison Francis Kurkdjian", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Aqua Vitae"] },
  { slug: "oud-silk-mood-velvet-mood-satin-mood", name: "Oud Silk Mood, Velvet Mood, Satin Mood", brand: "Maison Francis Kurkdjian", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["Oud Silk Mood", "Velvet Mood", "Satin Mood"] },
  { slug: "a-la-rose", name: "À la rose", brand: "Maison Francis Kurkdjian", inStock: true, price: 99, images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"], fragrances: ["À la rose"] },

  // Dummy products to reach 70+
  ...Array.from({length: 20}, (_, i) => ({
    slug: `dummy-product-${i+1}`,
    name: `Dummy Product ${i+1}`,
    brand: "Demo",
    inStock: true,
    price: 99,
    images: ["/product-images/placeholder.png", "/product-images/placeholder.png", "/product-images/placeholder.png"],
    fragrances: ["Demo Fragrance"]
  }))
]; 