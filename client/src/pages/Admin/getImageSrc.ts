export const getImageSrc = (img?: string): string => {
  if (!img) return '/fallback.png';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;

  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
  const root = base ? base.replace(/\/api\/?$/, '') : 'http://localhost:3000';
  return `${root}/material/${img}`;
};