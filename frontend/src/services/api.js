import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // No hardcoding
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("📤 Attaching token to request:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getLeaves = () => API.get("/leaves");
export const applyLeave = (data) => API.post("/leaves", data);
export const updateLeaveStatus = (id, status) =>
  API.patch(`/leaves/${id}`, { status });

export default API;
