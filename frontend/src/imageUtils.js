export const optimizeImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return url;
  }

  const normalizedUrl = url.replace('http://res.cloudinary.com', 'https://res.cloudinary.com');

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Optimize Cloudinary-hosted assets by injecting transformation params.
  if (normalizedUrl.includes('res.cloudinary.com') && normalizedUrl.includes('/upload/')) {
    if (normalizedUrl.includes('f_auto') && normalizedUrl.includes('q_auto')) {
      return normalizedUrl;
    }

    const transforms = [`f_${format}`, `q_${quality}`];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (width || height) transforms.push(`c_${crop}`);

    return normalizedUrl.replace('/upload/', `/upload/${transforms.join(',')}/`);
  }

  return normalizedUrl;
};

const fallbackImageCatalog = {
  keyboard: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
  ],
  speaker: [
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80',
  ],
  camera: [
    'https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=900&q=80',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  ],
  headphones: [
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
  ],
  backpack: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a45?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80',
  ],
  book: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
  ],
  clothes: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80',
  ],
  food: [
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
  ],
  home: [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80',
  ],
};

const placeholderUrlPattern = /dummyimage\.com|placehold\.co|placeholder\.com/i;

const hashString = (value = '') => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const resolveCatalogKey = (name = '', category = '') => {
  const haystack = `${name} ${category}`.toLowerCase();

  if (haystack.includes('keyboard')) return 'keyboard';
  if (haystack.includes('speaker')) return 'speaker';
  if (haystack.includes('camera') || haystack.includes('lens')) return 'camera';
  if (haystack.includes('laptop') || haystack.includes('ultrabook')) return 'laptop';
  if (haystack.includes('headphone') || haystack.includes('earbud')) return 'headphones';
  if (haystack.includes('backpack') || haystack.includes('bag')) return 'backpack';
  if (haystack.includes('book')) return 'book';
  if (haystack.includes('shoe') || haystack.includes('cloth') || haystack.includes('fashion')) return 'clothes';
  if (haystack.includes('food') || haystack.includes('tea') || haystack.includes('oats') || haystack.includes('bar')) return 'food';
  if (haystack.includes('sport') || haystack.includes('yoga') || haystack.includes('fitness')) return 'sports';
  if (haystack.includes('home') || haystack.includes('kitchen') || haystack.includes('lamp')) return 'home';
  if (haystack.includes('electronic') || haystack.includes('plug') || haystack.includes('usb')) return 'electronics';

  return 'default';
};

const fallbackImageForProduct = (name = '', category = '') => {
  const key = resolveCatalogKey(name, category);
  const catalog = fallbackImageCatalog[key] || fallbackImageCatalog.default;
  const imageIndex = hashString(`${name}-${category}-${key}`) % catalog.length;
  return catalog[imageIndex];
};

export const resolveProductCardImage = (images, name = '', category = '', optimizeOptions = {}) => {
  const rawUrl = Array.isArray(images) && images[0]?.url ? images[0].url : '';

  if (typeof rawUrl === 'string' && rawUrl.trim() && !placeholderUrlPattern.test(rawUrl)) {
    return optimizeImageUrl(rawUrl, optimizeOptions);
  }

  return fallbackImageForProduct(name, category);
};
