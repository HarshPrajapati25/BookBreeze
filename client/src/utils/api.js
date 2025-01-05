// src/utils/api.js
import axios from 'axios';
console.log(process.env.REACT_APP_API_URL, "api url");

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://bookbreeze-l6s2.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
});
// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response;
    },
    (error) => {
        // Handle different types of errors
        if (error.response) {
            // Handle 401 Unauthorized errors
            if (error.response.status === 401) {
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Redirect to login page
                window.location.href = '/login';
            }

            // Handle 403 Forbidden errors
            if (error.response.status === 403) {
                console.error('Permission denied');
            }

            // Handle 404 Not Found errors
            if (error.response.status === 404) {
                console.error('Resource not found');
            }

            // Handle 500 Internal Server errors
            if (error.response.status >= 500) {
                console.error('Server error');
            }
        } else if (error.request) {
            // Handle network errors
            console.error('Network error. Please check your connection.');
        } else {
            // Handle other errors
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API endpoints
const endpoints = {
    // Auth endpoints
    auth: {
        login: (data) => api.post('/auth/login', data),
        signup: (data) => api.post('/auth/signup', data),
        forgotPassword: (email) => api.post('/auth/forgot-password', email),
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Books endpoints
    books: {
        create: (data) => api.post('/books', data),
        getOwn: () => api.get('/books/own'),
        getAvailable: () => api.get('/books/available'),
        request: (data) => api.post('/books/request', data),
        update: (id, data) => api.put(`/books/${id}`, data),
        delete: (id) => api.delete(`/books/${id}`)
    }
};

// Export both the axios instance and endpoints
export { api as default, endpoints };

// Usage example:
/*
import api, { endpoints } from '../utils/api';

// Using the axios instance directly
await api.get('/some/endpoint');

// Using the endpoints object
await endpoints.auth.login({ email, password });
await endpoints.books.getAvailable();
*/
