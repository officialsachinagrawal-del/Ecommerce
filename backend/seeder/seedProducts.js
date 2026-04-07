const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('../model/productModel');

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

const categoryCatalog = {
  Electronics: [
    { name: 'Wireless Keyboard', description: 'Slim wireless keyboard with quiet keys and long battery life.' },
    { name: 'Bluetooth Speaker', description: 'Portable speaker with clear sound and deep bass.' },
    { name: 'Smart Plug', description: 'Wi-Fi smart plug for remote appliance control.' },
    { name: 'USB-C Hub', description: 'Multi-port hub with HDMI, USB, and card reader support.' },
    { name: 'Power Bank', description: 'Fast-charging power bank for phones and tablets.' }
  ],
  Cameras: [
    { name: 'Mirrorless Camera', description: 'Lightweight mirrorless camera for photo and video creators.' },
    { name: 'Camera Tripod', description: 'Stable aluminum tripod for smooth shots.' },
    { name: 'Prime Lens 50mm', description: 'Sharp prime lens for portraits and low-light scenes.' },
    { name: 'Camera Backpack', description: 'Padded backpack designed to protect camera gear.' },
    { name: 'Action Camera', description: 'Compact action camera with wide-angle recording.' }
  ],
  Laptop: [
    { name: 'Ultrabook 14', description: 'Thin and light laptop built for daily work.' },
    { name: 'Gaming Laptop 15', description: 'High-performance laptop for gaming and rendering.' },
    { name: 'Student Laptop 13', description: 'Affordable laptop for classes and assignments.' },
    { name: 'Business Laptop Pro', description: 'Reliable laptop with enhanced security features.' },
    { name: 'Creator Laptop X', description: 'Color-accurate display ideal for designers and editors.' }
  ],
  Accessories: [
    { name: 'Travel Backpack', description: 'Durable backpack with laptop and accessory compartments.' },
    { name: 'Laptop Sleeve', description: 'Soft protective sleeve for daily commute.' },
    { name: 'Phone Stand', description: 'Adjustable desk stand for phones and small tablets.' },
    { name: 'Cable Organizer', description: 'Neat organizer for chargers, cables, and adapters.' },
    { name: 'Card Holder Wallet', description: 'Minimal wallet with quick-access card slots.' }
  ],
  Headphones: [
    { name: 'Over-Ear Headphones', description: 'Comfort-fit over-ear headphones with rich sound.' },
    { name: 'Noise Cancelling Headphones', description: 'Active noise cancelling for focused listening.' },
    { name: 'Wireless Earbuds', description: 'Compact earbuds with charging case.' },
    { name: 'Studio Headphones', description: 'Balanced audio profile for editing and monitoring.' },
    { name: 'Sports Earbuds', description: 'Sweat-resistant earbuds designed for workouts.' }
  ],
  Food: [
    { name: 'Protein Bar Box', description: 'High-protein snack bars for active lifestyle.' },
    { name: 'Dry Fruits Mix', description: 'Premium mixed dry fruits for healthy snacking.' },
    { name: 'Organic Green Tea', description: 'Refreshing antioxidant-rich green tea leaves.' },
    { name: 'Whole Grain Cookies', description: 'Crunchy cookies made with whole grains.' },
    { name: 'Instant Oats Pack', description: 'Quick and nutritious breakfast oats.' }
  ],
  Books: [
    { name: 'JavaScript Mastery', description: 'Practical guide to modern JavaScript development.' },
    { name: 'Node.js in Action', description: 'Hands-on backend development with Node.js.' },
    { name: 'Clean Code Basics', description: 'Readable and maintainable coding practices.' },
    { name: 'UI Design Essentials', description: 'Foundations of beautiful and usable interfaces.' },
    { name: 'Startup Playbook', description: 'Real-world business and product building lessons.' }
  ],
  'Clothes/Shoes': [
    { name: 'Casual Sneakers', description: 'Comfortable sneakers for daily wear.' },
    { name: 'Running Shoes', description: 'Lightweight shoes designed for training runs.' },
    { name: 'Cotton T-Shirt', description: 'Breathable cotton t-shirt with regular fit.' },
    { name: 'Denim Jeans', description: 'Classic denim jeans with modern cut.' },
    { name: 'Hooded Sweatshirt', description: 'Warm hoodie for casual and travel use.' }
  ],
  'Beauty/Health': [
    { name: 'Face Cleanser', description: 'Gentle cleanser suitable for daily routine.' },
    { name: 'Vitamin C Serum', description: 'Brightening serum for healthy skin texture.' },
    { name: 'Sunscreen SPF 50', description: 'Broad-spectrum sunscreen for outdoor protection.' },
    { name: 'Hair Care Kit', description: 'Complete shampoo and conditioner combo.' },
    { name: 'Wellness Gummies', description: 'Daily wellness gummies for active adults.' }
  ],
  Sports: [
    { name: 'Yoga Mat', description: 'Non-slip yoga mat for home workouts.' },
    { name: 'Dumbbell Set', description: 'Adjustable dumbbells for strength training.' },
    { name: 'Football', description: 'Durable football for training and matches.' },
    { name: 'Cricket Bat', description: 'Balanced bat with solid sweet spot.' },
    { name: 'Fitness Band', description: 'Track steps, sleep, and heart rate daily.' }
  ],
  Outdoor: [
    { name: 'Camping Tent', description: 'Water-resistant tent suitable for weekend trips.' },
    { name: 'Trekking Bag', description: 'Spacious hiking backpack with support straps.' },
    { name: 'Portable Lantern', description: 'Rechargeable lantern for camping and power cuts.' },
    { name: 'Insulated Bottle', description: 'Hot/cold bottle for long outdoor use.' },
    { name: 'Folding Chair', description: 'Compact folding chair for picnics and camps.' }
  ],
  Home: [
    { name: 'Desk Lamp', description: 'Adjustable desk lamp for study and work.' },
    { name: 'Wall Clock', description: 'Minimal wall clock for living room and office.' },
    { name: 'Storage Basket Set', description: 'Multi-size baskets to organize essentials.' },
    { name: 'Bedside Organizer', description: 'Compact organizer for phone and accessories.' },
    { name: 'Kitchen Knife Set', description: 'Stainless steel knife set for daily cooking.' }
  ]
};

const PRODUCTS_PER_CATEGORY = 20;
const SEARCHAPI_ENDPOINT = 'https://www.searchapi.io/api/v1/search';

const categoryImageKeyword = {
  Electronics: 'electronics',
  Cameras: 'camera',
  Laptop: 'laptop',
  Accessories: 'accessory',
  Headphones: 'headphones',
  Food: 'food',
  Books: 'book',
  'Clothes/Shoes': 'fashion',
  'Beauty/Health': 'skincare',
  Sports: 'sports',
  Outdoor: 'outdoor',
  Home: 'home',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const unique = (list) => [...new Set(list.filter(Boolean))];

const categoryFixedImages = {
  Electronics: [
    'https://dummyimage.com/800x800/4A90E2/FFFFFF',
    'https://dummyimage.com/800x800/4A70E2/FFFFFF',
    'https://dummyimage.com/800x800/4A50E2/FFFFFF',
    'https://dummyimage.com/800x800/4A30E2/FFFFFF',
    'https://dummyimage.com/800x800/4A10E2/FFFFFF',
    'https://dummyimage.com/800x800/6A90E2/FFFFFF',
    'https://dummyimage.com/800x800/2A90E2/FFFFFF',
    'https://dummyimage.com/800x800/4A90C2/FFFFFF'
  ],
  Cameras: [
    'https://dummyimage.com/800x800/E24A4A/FFFFFF',
    'https://dummyimage.com/800x800/E22A4A/FFFFFF',
    'https://dummyimage.com/800x800/E20A4A/FFFFFF',
    'https://dummyimage.com/800x800/E24A2A/FFFFFF',
    'https://dummyimage.com/800x800/E24A0A/FFFFFF',
    'https://dummyimage.com/800x800/C24A4A/FFFFFF',
    'https://dummyimage.com/800x800/F24A4A/FFFFFF',
    'https://dummyimage.com/800x800/E24A6A/FFFFFF'
  ],
  Laptop: [
    'https://dummyimage.com/800x800/90E24A/FFFFFF',
    'https://dummyimage.com/800x800/70E24A/FFFFFF',
    'https://dummyimage.com/800x800/B0E24A/FFFFFF',
    'https://dummyimage.com/800x800/90C24A/FFFFFF',
    'https://dummyimage.com/800x800/90F24A/FFFFFF',
    'https://dummyimage.com/800x800/90E22A/FFFFFF',
    'https://dummyimage.com/800x800/90E20A/FFFFFF',
    'https://dummyimage.com/800x800/90E24A/CCCCCC'
  ],
  Accessories: [
    'https://dummyimage.com/800x800/E2A04A/FFFFFF',
    'https://dummyimage.com/800x800/E2804A/FFFFFF',
    'https://dummyimage.com/800x800/E2C04A/FFFFFF',
    'https://dummyimage.com/800x800/E2A02A/FFFFFF',
    'https://dummyimage.com/800x800/E2A00A/FFFFFF',
    'https://dummyimage.com/800x800/C2A04A/FFFFFF',
    'https://dummyimage.com/800x800/F2A04A/FFFFFF',
    'https://dummyimage.com/800x800/E2A06A/FFFFFF'
  ],
  Headphones: [
    'https://dummyimage.com/800x800/A04AE2/FFFFFF',
    'https://dummyimage.com/800x800/804AE2/FFFFFF',
    'https://dummyimage.com/800x800/C04AE2/FFFFFF',
    'https://dummyimage.com/800x800/A02AE2/FFFFFF',
    'https://dummyimage.com/800x800/A00AE2/FFFFFF',
    'https://dummyimage.com/800x800/804AC2/FFFFFF',
    'https://dummyimage.com/800x800/A04AF2/FFFFFF',
    'https://dummyimage.com/800x800/A04AC2/FFFFFF'
  ],
  Food: [
    'https://dummyimage.com/800x800/4AE2A0/FFFFFF',
    'https://dummyimage.com/800x800/2AE2A0/FFFFFF',
    'https://dummyimage.com/800x800/6AE2A0/FFFFFF',
    'https://dummyimage.com/800x800/4AC2A0/FFFFFF',
    'https://dummyimage.com/800x800/4AE280/FFFFFF',
    'https://dummyimage.com/800x800/4AE2C0/FFFFFF',
    'https://dummyimage.com/800x800/4AF2A0/FFFFFF',
    'https://dummyimage.com/800x800/4AE2B0/FFFFFF'
  ],
  Books: [
    'https://dummyimage.com/800x800/E24AA0/FFFFFF',
    'https://dummyimage.com/800x800/E22AA0/FFFFFF',
    'https://dummyimage.com/800x800/E20AA0/FFFFFF',
    'https://dummyimage.com/800x800/E24A80/FFFFFF',
    'https://dummyimage.com/800x800/E24AC0/FFFFFF',
    'https://dummyimage.com/800x800/C24AA0/FFFFFF',
    'https://dummyimage.com/800x800/F24AA0/FFFFFF',
    'https://dummyimage.com/800x800/E24A60/FFFFFF'
  ],
  'Clothes/Shoes': [
    'https://dummyimage.com/800x800/E2E24A/FFFFFF',
    'https://dummyimage.com/800x800/E2C24A/FFFFFF',
    'https://dummyimage.com/800x800/E2E20A/FFFFFF',
    'https://dummyimage.com/800x800/C2C24A/FFFFFF',
    'https://dummyimage.com/800x800/F2F24A/FFFFFF',
    'https://dummyimage.com/800x800/E2E26A/FFFFFF',
    'https://dummyimage.com/800x800/E2E24A/CCCCCC',
    'https://dummyimage.com/800x800/E2D24A/FFFFFF'
  ],
  'Beauty/Health': [
    'https://dummyimage.com/800x800/4AE2E2/FFFFFF',
    'https://dummyimage.com/800x800/2AE2E2/FFFFFF',
    'https://dummyimage.com/800x800/6AE2E2/FFFFFF',
    'https://dummyimage.com/800x800/4AC2E2/FFFFFF',
    'https://dummyimage.com/800x800/4AE2C2/FFFFFF',
    'https://dummyimage.com/800x800/4AF2E2/FFFFFF',
    'https://dummyimage.com/800x800/4AE2F2/FFFFFF',
    'https://dummyimage.com/800x800/4AE2D2/FFFFFF'
  ],
  Sports: [
    'https://dummyimage.com/800x800/E2704A/FFFFFF',
    'https://dummyimage.com/800x800/E2504A/FFFFFF',
    'https://dummyimage.com/800x800/E2904A/FFFFFF',
    'https://dummyimage.com/800x800/C2704A/FFFFFF',
    'https://dummyimage.com/800x800/F2704A/FFFFFF',
    'https://dummyimage.com/800x800/E2704A/CCCCCC',
    'https://dummyimage.com/800x800/E2705A/FFFFFF',
    'https://dummyimage.com/800x800/E2708A/FFFFFF'
  ],
  Outdoor: [
    'https://dummyimage.com/800x800/70E24A/FFFFFF',
    'https://dummyimage.com/800x800/50E24A/FFFFFF',
    'https://dummyimage.com/800x800/90E24A/FFFFFF',
    'https://dummyimage.com/800x800/70C24A/FFFFFF',
    'https://dummyimage.com/800x800/70E20A/FFFFFF',
    'https://dummyimage.com/800x800/70E26A/FFFFFF',
    'https://dummyimage.com/800x800/70F24A/FFFFFF',
    'https://dummyimage.com/800x800/70E24A/CCCCCC'
  ],
  Home: [
    'https://dummyimage.com/800x800/4A70E2/FFFFFF',
    'https://dummyimage.com/800x800/2A70E2/FFFFFF',
    'https://dummyimage.com/800x800/6A70E2/FFFFFF',
    'https://dummyimage.com/800x800/4A50E2/FFFFFF',
    'https://dummyimage.com/800x800/4A90E2/FFFFFF',
    'https://dummyimage.com/800x800/4A70C2/FFFFFF',
    'https://dummyimage.com/800x800/4A70F2/FFFFFF',
    'https://dummyimage.com/800x800/4A70E2/CCCCCC'
  ]
};

const extractImageUrls = (payload) => {
  const candidates = [];

  const pushUrl = (value) => {
    if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
      candidates.push(value);
    }
  };

  const imageResults = Array.isArray(payload?.images_results) ? payload.images_results : [];
  for (const item of imageResults) {
    pushUrl(item?.original);
    pushUrl(item?.image);
    pushUrl(item?.thumbnail);
  }

  const inlineImages = Array.isArray(payload?.inline_images) ? payload.inline_images : [];
  for (const item of inlineImages) {
    pushUrl(item?.original);
    pushUrl(item?.source);
    pushUrl(item?.thumbnail);
  }

  const organicResults = Array.isArray(payload?.organic_results) ? payload.organic_results : [];
  for (const item of organicResults) {
    pushUrl(item?.thumbnail);
  }

  return unique(candidates);
};

const fetchCategoryImages = async (category, count, searchApiKey) => {
  const keyword = categoryImageKeyword[category] || category;

  // Use curated fixed images as primary source
  const fixedImages = categoryFixedImages[category] || categoryFixedImages.Electronics;
  const fallback = Array.from({ length: count }, (_, idx) => fixedImages[idx % fixedImages.length]);

  if (!searchApiKey) {
    return fallback;
  }

  try {
    const url = new URL(SEARCHAPI_ENDPOINT);
    url.searchParams.set('api_key', searchApiKey.trim());
    url.searchParams.set('engine', 'google_images');
    url.searchParams.set('q', `${category} product ecommerce`);
    url.searchParams.set('num', String(Math.max(count, 20)));
    url.searchParams.set('safe', 'active');

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.log(`SearchAPI image fetch failed for ${category}: ${response.status}`);
      return fallback;
    }

    const payload = await response.json();
    const urls = extractImageUrls(payload);

    if (urls.length === 0) {
      console.log(`SearchAPI returned no image URLs for ${category}; using fallback.`);
      return fallback;
    }

    // Repeat URLs if API gives less than needed.
    const selected = [];
    for (let i = 0; i < count; i += 1) {
      selected.push(urls[i % urls.length]);
    }

    return selected;
  } catch (error) {
    console.log(`SearchAPI error for ${category}: ${error.message}`);
    return fallback;
  }
};

const buildSeedProducts = (categoryImagesMap) => Object.entries(categoryCatalog).flatMap(([category, templates], categoryIndex) => {
  const categorySlug = slugify(category);
  const categoryImages = categoryImagesMap[category] || [];

  return Array.from({ length: PRODUCTS_PER_CATEGORY }, (_, itemIndex) => {
    const index = itemIndex + 1;
    const seedId = `${categorySlug}-${index}`;
    const template = templates[itemIndex % templates.length];
    const edition = Math.floor(itemIndex / templates.length) + 1;

    return {
      name: `${template.name} ${edition}`,
      description: `${template.description} (${category} edition ${edition}).`,
      category,
      price: Number((19 + categoryIndex * 7 + index * 2.35).toFixed(2)),
      quantity: 10 + ((index * 3) % 50),
      ratings: Number((3.5 + ((index + categoryIndex) % 6) * 0.25).toFixed(1)),
      numOfReviews: 5 + ((index * 2 + categoryIndex) % 40),
      images: [
        {
          public_id: `seed-${seedId}`,
          url: categoryImages[itemIndex]
        }
      ]
    };
  });
});

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  const searchApiKey = process.env.SEARCHAPI_KEY || process.env.SEARCH_API_KEY;

  if (!mongoUri) {
    throw new Error('MONGODB_URI/MONGODB_URL not found in backend/config/.env');
  }

  const categoryImagesMap = {};
  for (const category of Object.keys(categoryCatalog)) {
    categoryImagesMap[category] = await fetchCategoryImages(category, PRODUCTS_PER_CATEGORY, searchApiKey);
  }

  const seedProducts = buildSeedProducts(categoryImagesMap);

  await mongoose.connect(mongoUri);

  await Product.deleteMany({
    'images.public_id': { $regex: /^seed-/ }
  });

  await Product.insertMany(seedProducts);

  console.log(`Seeded ${seedProducts.length} products successfully.`);
  await mongoose.connection.close();
}

runSeed()
  .catch(async (error) => {
    console.error('Product seed failed:', error.message);
    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
    }
    process.exit(1);
  });
