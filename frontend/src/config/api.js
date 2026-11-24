const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const apiOrigin = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

export const API_BASE_URL = apiOrigin;

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath;
}

export function getAuthHeaders(extra = {}) {
  const headers = { ...extra };
  try {
    const token = localStorage.getItem('campusbuzz_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore storage read issues
  }
  return headers;
}
