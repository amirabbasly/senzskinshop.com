const INTERNAL_API = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
export const CLIENT_API = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request(path) {
  try {
    const res = await fetch(`${INTERNAL_API}/api${path}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      if (res.status !== 404) console.warn(`[api] ${path} → ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[api] ${path} unreachable: ${err.message}`);
    return null;
  }
}

export const apiGet = request;

export const getSettings = () => request('/settings');
export const getCategories = () => request('/categories');
export const getBrands = () => request('/brands');
export const getHome = () => request('/home');
export const getProducts = (query = '') => request(`/products${query}`);
export const getProduct = (slug) => request(`/products/${encodeURIComponent(slug)}`);
export const getBanners = (placement = 'hero') => request(`/banners?placement=${placement}`);
export const getPosts = () => request('/posts');
export const getPost = (slug) => request(`/posts/${encodeURIComponent(slug)}`);
export const getOrder = (code) => request(`/orders/track/${encodeURIComponent(code)}`);
