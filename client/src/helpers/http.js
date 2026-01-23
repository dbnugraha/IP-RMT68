import axios from "axios";
import Swal from "sweetalert2";

const http = axios.create({
  baseURL: "https://api.jobberint.space",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

// Request interceptor to update token on each request
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

// Response interceptor to handle 401 errors
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.message === "Invalid token") {
      // Clear token from localStorage
      localStorage.removeItem("token");

      // Show SweetAlert
      await Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please login again.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Go to Login",
      });

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default http;
