export const optimizeImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return url;
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Optimize Cloudinary-hosted assets by injecting transformation params.
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const transforms = [`f_${format}`, `q_${quality}`];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (width || height) transforms.push(`c_${crop}`);

    return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
  }

  return url;
};
