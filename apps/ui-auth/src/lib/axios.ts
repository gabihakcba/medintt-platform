import axios from "axios";

const api = axios.create({
  baseURL: process.env.AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
