import axios from "axios";

/* ===============================
   CREATE INSTANCE
=============================== */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // from .env
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
   → Attach token automatically
=============================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
   → Handle errors globally
=============================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Handle unauthorized (auto logout)
    if (error.response?.status === 401) {
      console.warn("Unauthorized - logging out");

      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect
    }

    // 🔥 Optional: handle server errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;