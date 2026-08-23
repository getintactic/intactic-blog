const API_BASE = '/api/admin';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json', ...options?.headers }, ...options });
  if (!res.ok) { const err = await res.json().catch(() => ({ error: 'Request failed' })); throw new Error(err.error || `HTTP ${res.status}`); }
  return res.json();
}

function crud<T>(path: string) {
  return {
    getAll: () => fetchApi<T[]>(`${API_BASE}/${path}`),
    getById: (id: string) => fetchApi<T>(`${API_BASE}/${path}/${id}`),
    create: (data: Partial<T>) => fetchApi<T>(`${API_BASE}/${path}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<T>) => fetchApi<T>(`${API_BASE}/${path}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<{ success: boolean }>(`${API_BASE}/${path}/${id}`, { method: 'DELETE' }),
  };
}

export const blogPosts = crud<any>('blog');
export const authors = crud<any>('authors');
export const blogCategories = crud<any>('blog-categories');
