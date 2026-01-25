import axios from "axios";

/**
 * Global upgrade handler
 * - We set this from App.jsx using setUpgradeHandler(showUpgrade)
 * - When backend returns 402, this will trigger the modal globally
 */
let upgradeHandler = null;

export const setUpgradeHandler = (fn) => {
  upgradeHandler = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// ✅ Attach JWT token automatically for every request
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

// ✅ Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;

    // ✅ Daily limit / upgrade required
    if (status === 402 && typeof upgradeHandler === "function") {
      upgradeHandler(detail || "Daily limit reached. Upgrade to Pro to continue.");
    }

    return Promise.reject(error);
  }
);

export default api;
