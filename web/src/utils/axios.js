/**
 * Axios instance for API requests (used across the frontend).
 * Sets up a base URL and default headers.
 */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
