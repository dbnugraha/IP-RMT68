import axios from "axios";

const http = axios.create({
  baseURL: "https://api.jobberint.space",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

export default http;
