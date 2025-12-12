// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // your server URL
});

// Add token automatically for protected routes
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // saved after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
