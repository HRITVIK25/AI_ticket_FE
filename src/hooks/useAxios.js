import axios from "axios";

/**
 * Create a single axios instance for your backend
 */
export const api = axios.create({
  baseURL: import.meta.env.REACT_BASE_URL || "http://127.0.0.1:8000/", // FastAPI backend
});

/**
 * Setup interceptor to attach Clerk Bearer token
 * @param {Function} getToken - Clerk's getToken function
 */
export const setupInterceptors = (getToken) => {
  const interceptor = api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Error fetching Clerk token:", err);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return interceptor;
};