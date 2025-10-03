export const products = [
  {
    _id: '1',
    name: 'Dior Sauvage',
    description: 'A powerful fresh and woody fragrance with notes of bergamot, ambroxan, and vanilla.',
    price: 155.00,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'],
    category: 'Men',
    inStock: true
  },
  {
    _id: '2',
    name: 'Chanel N°5',
    description: 'The classic floral-aldehyde fragrance with rose and jasmine notes.',
    price: 145.00,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'],
    category: 'Women',
    inStock: true
  },
  {
    _id: '3',
    name: 'Bleu de Chanel',
    description: 'A woody aromatic fragrance with citrus and amber notes.',
    price: 132.00,
    images: ['https://images.unsplash.com/photo-1595425964272-5437c8a18827?q=80&w=800&auto=format&fit=crop'],
    category: 'Men',
    inStock: true
  },
  {
    _id: '4',
    name: 'Jo Malone London',
    description: 'English Pear & Freesia Cologne with a fresh and subtle scent.',
    price: 142.00,
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop'],
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '5',
    name: 'Tom Ford Black Orchid',
    description: 'A luxurious and sensual fragrance with black truffle and orchid.',
    price: 168.00,
    images: ['https://images.unsplash.com/photo-1592914610354-9e5f3a4f7cc5?q=80&w=800&auto=format&fit=crop'],
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '6',
    name: 'Yves Saint Laurent Libre',
    description: 'A floral fragrance with lavender essence and orange blossom.',
    price: 128.00,
    images: ['https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop'],
    category: 'Women',
    inStock: true
  },
  {
    _id: '7',
    name: 'Versace Eros',
    description: 'An intense and vibrant fragrance with mint leaves and vanilla.',
    price: 112.00,
    images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800&auto=format&fit=crop'],
    category: 'Men',
    inStock: true
  },
  {
    _id: '8',
    name: 'Marc Jacobs Daisy',
    description: 'A fresh and feminine fragrance with wild berries and white violet.',
    price: 98.00,
    images: ['https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop'],
    category: 'Women',
    inStock: true
  },
  {
    _id: '9',
    name: 'Creed Aventus',
    description: 'A fruity and rich fragrance with blackcurrant and birch.',
    price: 325.00,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'],
    category: 'Men',
    inStock: true
  },
  {
    _id: '10',
    name: 'Byredo Gypsy Water',
    description: 'A woody aromatic with bergamot and vanilla notes.',
    price: 196.00,
    images: ['https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop'],
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '11',
    name: 'Noamani-p1',
    slug: 'noamani-p1',
    images: [
      '/product1.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png'
    ],
    description: 'A luxurious blend of rose and saffron.',
    price: 199.00,
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '12',
    name: 'Pimento',
    slug: 'pimento',
    subtitle: 'Parfum - Spicy and Woody Notes - Refillable',
    price: 185.00,
    sizes: [
      { label: '30 mL', value: 30, price: 90 },
      { label: '60 mL', value: 60, price: 140 },
      { label: '100 mL', value: 100, price: 185 }
    ],
    images: [
      '/product-images/1750533487467-958391509-boxs.png',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Pimento is a spicy, warm fragrance with pimento and woods.',
    olfactoryNotes: 'Opens with spicy pimento, heart of cedarwood, base of amber.',
    perfumersWord: 'Crafted for those who love bold, spicy scents.',
    knowHow: 'Blended with the finest spices and woods for a long-lasting effect.',
    applicationTips: 'Spray on pulse points for best results.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '13',
    name: 'Resin',
    slug: 'resin',
    subtitle: 'Parfum - Deep Resinous Notes - Refillable',
    price: 210.00,
    sizes: [
      { label: '30 mL', value: 30, price: 110 },
      { label: '60 mL', value: 60, price: 160 },
      { label: '100 mL', value: 100, price: 210 }
    ],
    images: [
      '/product100.png',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Resin features deep resinous notes for a bold statement.',
    olfactoryNotes: 'Opens with frankincense, heart of myrrh, base of amber.',
    perfumersWord: 'For those who want to stand out with a powerful scent.',
    knowHow: 'Expertly blended resins for a long-lasting, bold fragrance.',
    applicationTips: 'Apply to warm skin for best projection.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '14',
    name: 'Ocean Breeze',
    slug: 'ocean-breeze',
    subtitle: 'Parfum - Fresh Aquatic Notes - Refillable',
    price: 175.00,
    sizes: [
      { label: '30 mL', value: 30, price: 85 },
      { label: '60 mL', value: 60, price: 130 },
      { label: '100 mL', value: 100, price: 175 }
    ],
    images: [
      '/product4.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Ocean Breeze brings fresh aquatic notes inspired by the sea. This fragrance opens with a wave of sea salt and citrus, followed by a heart of delicate jasmine and water lily, and settles into a base of driftwood and soft musk. Perfect for those who love a refreshing, invigorating scent reminiscent of the ocean air.',
    olfactoryNotes: 'Top: Sea Salt, Citrus\nHeart: Jasmine, Water Lily\nBase: Driftwood, Musk',
    perfumersWord: 'Inspired by the freshness and energy of the ocean, Ocean Breeze is crafted for those who seek adventure and tranquility in every moment.',
    knowHow: 'Expertly blended marine and floral notes create a scent that is both uplifting and calming, perfect for any occasion.',
    applicationTips: 'Spray generously on pulse points for a long-lasting, refreshing feel.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '15',
    name: 'Rose Saffron',
    slug: 'rose-saffron',
    subtitle: 'Parfum - Rose & Saffron - Refillable',
    price: 189.00,
    sizes: [
      { label: '30 mL', value: 30, price: 95 },
      { label: '60 mL', value: 60, price: 140 },
      { label: '100 mL', value: 100, price: 189 }
    ],
    images: [
      '/product3.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Experience the opulence of Rose Saffron, a luxurious fragrance that blends the delicate essence of blooming roses with the exotic warmth of saffron. This signature scent opens with a burst of fresh petals, followed by a heart of golden saffron and subtle hints of amber.',
    olfactoryNotes: 'Opens with fresh rose petals, heart of saffron, base of amber.',
    perfumersWord: 'For those who appreciate elegance and sophistication.',
    knowHow: 'Blended with the finest rose and saffron for a memorable trail.',
    applicationTips: 'Spray on pulse points for a long-lasting scent.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '16',
    name: 'Velvet Orchid',
    slug: 'velvet-orchid',
    subtitle: 'Parfum - Rich Floral & Oriental Notes - Refillable',
    price: 220.00,
    sizes: [
      { label: '30 mL', value: 30, price: 110 },
      { label: '60 mL', value: 60, price: 170 },
      { label: '100 mL', value: 100, price: 220 }
    ],
    images: [
      '/product1.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product4.jpg'
    ],
    description: 'Velvet Orchid is a luxurious fragrance that combines rich floral notes with a touch of oriental warmth. The scent opens with vibrant bergamot and honey, followed by a heart of velvet orchid and rose, and finishes with a base of vanilla and sandalwood.',
    olfactoryNotes: 'Top: Bergamot, Honey\nHeart: Velvet Orchid, Rose\nBase: Vanilla, Sandalwood',
    perfumersWord: 'Created for those who desire elegance and sensuality in every moment.',
    knowHow: 'A masterful blend of rare flowers and warm oriental notes for a truly unforgettable scent.',
    applicationTips: 'Apply to pulse points for a long-lasting, enveloping fragrance.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '17',
    name: 'Royal Oud',
    slug: 'royal-oud',
    subtitle: 'Parfum - Majestic Oud & Spices - Refillable',
    price: 250.00,
    sizes: [
      { label: '30 mL', value: 30, price: 125 },
      { label: '60 mL', value: 60, price: 180 },
      { label: '100 mL', value: 100, price: 250 }
    ],
    images: [
      '/product2.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Royal Oud is a majestic fragrance that blends the deep, woody aroma of oud with spicy and resinous notes. It opens with a burst of pink pepper and cardamom, a heart of oud and cedarwood, and a base of amber and musk.',
    olfactoryNotes: 'Top: Pink Pepper, Cardamom\nHeart: Oud, Cedarwood\nBase: Amber, Musk',
    perfumersWord: 'For those who appreciate the richness and mystery of oud.',
    knowHow: 'Expertly crafted with the finest oud and spices for a regal scent experience.',
    applicationTips: 'Spray lightly on skin and clothing for a long-lasting, powerful impression.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '18',
    name: 'Amber Musk',
    slug: 'amber-musk',
    subtitle: 'Parfum - Warm Amber & Soft Musk - Refillable',
    price: 205.00,
    sizes: [
      { label: '30 mL', value: 30, price: 100 },
      { label: '60 mL', value: 60, price: 150 },
      { label: '100 mL', value: 100, price: 205 }
    ],
    images: [
      '/product3.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Amber Musk is a warm and inviting fragrance that envelops you in a blend of golden amber and soft musk. The scent opens with a hint of pear and bergamot, a heart of amber and jasmine, and a base of creamy musk and sandalwood.',
    olfactoryNotes: 'Top: Pear, Bergamot\nHeart: Amber, Jasmine\nBase: Musk, Sandalwood',
    perfumersWord: 'Perfect for those who love a cozy, comforting scent with a touch of sophistication.',
    knowHow: 'A harmonious blend of amber and musk for a scent that lingers beautifully.',
    applicationTips: 'Apply to warm areas of the skin for best projection and longevity.',
    category: 'Unisex',
    inStock: true
  },
  {
    _id: '19',
    name: 'Citrus Bloom',
    slug: 'citrus-bloom',
    subtitle: 'Parfum - Fresh Citrus & Blossoms - Refillable',
    price: 160.00,
    sizes: [
      { label: '30 mL', value: 30, price: 80 },
      { label: '60 mL', value: 60, price: 120 },
      { label: '100 mL', value: 100, price: 160 }
    ],
    images: [
      '/product4.jpg',
      '/newproduct-removebg-preview.png',
      '/productnew.png',
      '/product1.jpg'
    ],
    description: 'Citrus Bloom is a vibrant fragrance that captures the essence of fresh citrus fruits and blooming flowers. It opens with sparkling lemon and orange, a heart of neroli and peony, and a base of white musk and cedar.',
    olfactoryNotes: 'Top: Lemon, Orange\nHeart: Neroli, Peony\nBase: White Musk, Cedar',
    perfumersWord: 'For those who love a bright, uplifting scent that energizes the senses.',
    knowHow: 'A lively blend of citrus and floral notes for a refreshing, modern fragrance.',
    applicationTips: 'Spray on pulse points for a burst of freshness throughout the day.',
    category: 'Unisex',
    inStock: true
  }
]; 