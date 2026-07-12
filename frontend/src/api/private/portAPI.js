import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

// This interceptor will automatically add the Authorization header with the token for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("private_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }

  return config;
});

// Helper function to handle errors globally
const handleError = (error) => {
  if (error.response) {
    console.error(
      "Server error:",
      error.response.status,
      error.response.data
    );
    throw new Error(
      error.response.data.message || "Server responded with an error"
    );
  } else if (error.request) {
    console.error("No response from server:", error.message);
    throw new Error(
      "Server not responding. Please check your connection or try again later."
    );
  } else {
    console.error("Request setup error:", error.message);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

// Fetch all ports
export const fetchPorts = async () => {
  try {
    console.log("Fetching all ports");
    const res = await api.get("/ports");
    console.log("Ports fetched:", res.data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch single port by ID
export const fetchPortById = async (id) => {
  try {
    console.log("Fetching port by ID:", id);
    const res = await api.get(`/ports/${id}`);
    console.log("Port fetched:", res.data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Update port
export const updatePort = async (id, portData) => {
  try {
    console.log("Updating port:", id, portData);
    const res = await api.put(`/ports/${id}`, portData);
    console.log("Port updated successfully:", res.data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
