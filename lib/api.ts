// lib/api.ts
import axios from "axios";

const tokenKey = "patient_token";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api instance setup
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // ensure Axios/browser sets the multipart boundary
    delete (config.headers as any)["Content-Type"];
  }
  return config;
});
