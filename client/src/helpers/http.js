import axios from "axios";
import Swal from "sweetalert2";

const http = axios.create({
  baseURL: "https://api.jobberint.space",
});

// Add a request interceptor to dynamically set the token
http.interceptors.request.use(
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

export default http;
