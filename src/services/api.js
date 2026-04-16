import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "https://jobsfinderss.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for Retry Logic and Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Retry logic for network errors or 5xx server errors
    const MAX_RETRIES = 2;
    config.retryCount = config.retryCount || 0;

    if (config.retryCount < MAX_RETRIES && (!response || response.status >= 500)) {
      config.retryCount += 1;
      console.warn(`Retrying request (${config.retryCount}/${MAX_RETRIES})...`);
      
      // Exponential backoff
      const delay = Math.pow(2, config.retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(config);
    }

    // Handle 401 Unauthorized (expired token)
    if (response && response.status === 401) {
      localStorage.removeItem("token");
      // Optional: redirect to login or refresh token
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
