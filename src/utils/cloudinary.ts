/**
 * Cloudinary Media Optimization Utility
 * Generates ultra-lightweight, responsive URLs for videos and poster images
 */

export function getOptimizedVideoUrl(url: string, isMobile = false): string {
  if (!url) return '';
  const match = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(.*)/);
  if (!match) return url;

  const prefix = match[1];
  const rest = match[2];

  // If already transformed, don't duplicate
  if (rest.startsWith('f_auto') || rest.includes('vc_auto')) {
    return url;
  }

  const width = isMobile ? 640 : 960;
  return `${prefix}f_auto,q_auto,w_${width},vc_auto/${rest}`;
}

export function getOptimizedPosterUrl(url: string, isMobile = false): string {
  if (!url) return '';

  // Cloudinary video frame thumbnail
  const videoMatch = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(?:so_0\/)?(.*)/);
  if (videoMatch) {
    const prefix = videoMatch[1];
    let rest = videoMatch[2];
    // Replace .mp4 with .jpg if needed
    if (rest.endsWith('.mp4')) {
      rest = rest.replace(/\.mp4$/, '.jpg');
    }
    const width = isMobile ? 640 : 960;
    return `${prefix}so_0,f_auto,q_auto,w_${width}/${rest}`;
  }

  // Cloudinary image upload
  const imgMatch = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (imgMatch) {
    const prefix = imgMatch[1];
    const rest = imgMatch[2];
    if (rest.startsWith('f_auto')) return url;
    const width = isMobile ? 720 : 1440;
    return `${prefix}f_auto,q_auto,w_${width}/${rest}`;
  }

  return url;
}
