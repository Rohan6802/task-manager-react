import axios from "axios";

const prodURL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: prodURL ? `${prodURL}/api` : "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
