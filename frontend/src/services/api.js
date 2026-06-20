import axios from 'axios';

const API_URL = 'https://inventory-system-production-bda0.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle global error messages or logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Response:', error.response || error);
    // You can parse error messages here
    const message = error.response?.data?.detail || error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ ...error, customMessage: message });
  }
);

export const ProductService = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export const CustomerService = {
  getAll: () => apiClient.get('/customers'),
  getById: (id) => apiClient.get(`/customers/${id}`),
  create: (data) => apiClient.post('/customers', data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};

export const OrderService = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (data) => apiClient.post('/orders', data),
  delete: (id) => apiClient.delete(`/orders/${id}`), // Cancels and deletes order
};

export const DashboardService = {
  getSummary: () => apiClient.get('/dashboard/summary'),
};

export default apiClient;
