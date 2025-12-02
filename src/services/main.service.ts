import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_APP_API_URL;
const timeout = parseInt(import.meta.env.VITE_APP_TIMEOUT || "5000");

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("Error in response: ", error);
    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;
