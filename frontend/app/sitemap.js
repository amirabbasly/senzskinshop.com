import { getCategories, getPosts, getProducts } from '@/lib/api';

export const dynamic = 'force-dynamic';

const BASE = 'https://senzskinshop.com';

export default async function sitemap() {
  const [products, categories, posts] = await Promise.all([
    getProducts('?limit=60'),
    getCategories(),
    getPosts(),
  ]);

  const staticPages = ['', '/products', '/blog', '/about', '/contact', '/faq', '/track'].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  const categoryPages = (categories || []).flatMap((category) => [
    category,
    ...(category.children || []),
  ]).map((category) => ({
    url: `${BASE}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productPages = (products?.items || []).map((product) => ({
    url: `${BASE}/products/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const postPages = (posts || []).map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...postPages];
}
