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

export default axiosInstance;
