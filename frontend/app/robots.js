export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/cart', '/checkout'],
      },
    ],
    sitemap: 'https://senzskinshop.com/sitemap.xml',
    host: 'https://senzskinshop.com',
  };
}
