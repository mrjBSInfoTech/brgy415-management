const rawApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .trim()
  .replace(/\/+$/, "");

export const API_BASE_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl}/api`;

export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

export const getUploadUrl = (folder, filename) =>
  `${BACKEND_BASE_URL}/uploads/${folder}/${encodeURIComponent(filename)}`;
