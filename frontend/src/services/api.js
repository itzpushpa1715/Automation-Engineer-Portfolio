import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  changePassword: (data) => api.post('/auth/change-password', data),
  updateEmail: (data) => api.put('/auth/email', data),
  logout: () => api.post('/auth/logout'),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Skills API
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: (visible) => api.get('/projects', { params: { visible } }),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'technologies') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'image' && data[key]) {
        formData.append('image', data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => api.put(`/projects/${id}`, data),
  toggleVisibility: (id, visible) => api.patch(`/projects/${id}/visibility`, { visible }),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Experience API
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

// Education API
export const educationAPI = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

// Certifications API
export const certificationsAPI = {
  getAll: () => api.get('/certifications'),
  create: (data) => api.post('/certifications', data),
  update: (id, data) => api.put(`/certifications/${id}`, data),
  delete: (id) => api.delete(`/certifications/${id}`),
};

// Messages API
export const messagesAPI = {
  getAll: (status) => api.get('/messages', { params: { status } }),
  create: (data) => api.post('/messages', data),
  markAsRead: (id) => api.patch(`/messages/${id}/read`),
  markAsUnread: (id) => api.patch(`/messages/${id}/unread`),
  delete: (id) => api.delete(`/messages/${id}`),
};

export default api;
