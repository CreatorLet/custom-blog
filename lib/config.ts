import config from '@/blog.config.json';
export const blog = config;
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || blog.siteUrl).replace(/\/$/, '');
