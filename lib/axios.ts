import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  // withCredentials only needed if server uses cookies — JWT via header doesn't need it
  // and it causes CORS issues in production if server doesn't echo the origin
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("mq_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("mq_token");
      localStorage.removeItem("mq_user");
    }
    return Promise.reject(err);
  }
);

export default api;
