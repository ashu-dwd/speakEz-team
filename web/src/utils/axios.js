/**
 * Axios instance for API requests (used across the frontend).
 * Sets up a base URL and default headers.
 */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add a request interceptor to attach the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (auth) {
      try {
        const { accessToken } = JSON.parse(auth);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (e) {
        console.error("Error parsing auth token", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = localStorage.getItem("auth") || sessionStorage.getItem("auth");
        if (!auth) {
            return Promise.reject(error);
        }
        
        const { refreshToken } = JSON.parse(auth);
        if (!refreshToken) {
             return Promise.reject(error);
        }

        // Call refresh endpoint
        const res = await axios.post(import.meta.env.VITE_APP_API_URL + "/api/user/refresh-token", {
          refreshToken,
        });

        if (res.data && res.data.success && res.data.accessToken) {
          // Update local storage with new access token
          const authData = JSON.parse(auth);
          authData.accessToken = res.data.accessToken;
          
          if (localStorage.getItem("auth")) {
            localStorage.setItem("auth", JSON.stringify(authData));
          } else {
            sessionStorage.setItem("auth", JSON.stringify(authData));
          }

          // Update header and retry original request
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem("auth");
        sessionStorage.removeItem("auth");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
