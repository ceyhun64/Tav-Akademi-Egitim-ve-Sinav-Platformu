import axios from "axios";
import emitter from "./eventEmitter"; // event emitter’ı import et

const API_URL = `${import.meta.env.VITE_API_URL}`;
console.log("API URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");


    console.log("Token:", token);
    console.log("Session ID:", sessionId);
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    if (sessionId) {
      config.headers["x-session-id"] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");

      alert("Oturumunuz sona erdi. Lütfen tekrar giriş yapınız.");
      window.location.href = "/login/user";
    } else if (error.response && error.response.status === 403) {
      // 403 geldiğinde event yayınla
      emitter.emit("showUnauthorizedModal");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
