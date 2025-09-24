// frontend/lib/api.js

import axios from "axios";

const api = axios.create({
  // Use the environment variable for the base URL
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Automatically send cookies with every request
  withCredentials: true,
});

export default api;
