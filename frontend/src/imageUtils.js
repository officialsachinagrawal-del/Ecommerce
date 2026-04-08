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
