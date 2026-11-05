import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("public_token");

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

const handleError = (error) => {
  if (error.response) {
    console.error("Server error:", error.response.status, error.response.data);
    throw new Error(error.response.data.message || "Server responded with an error");
  } else if (error.request) {
    console.error("No response from server:", error.message);
    throw new Error("Server not responding. Please check your connection or try again later.");
  } else {
    console.error("Request setup error:", error.message);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export const fetchOtherInfo = async () => {
  try {
    const res = await api.get("/otherinfo");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
