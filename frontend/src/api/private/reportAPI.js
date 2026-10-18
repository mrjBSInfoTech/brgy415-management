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

// Fetch all reports
export const fetchReports = async () => {
  try {
    const res = await api.get("/reports");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch single report by ID
export const fetchReportById = async (id) => {
  try {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Add new report
export const addReport = async (reportData) => {
  try {
    const res = await api.post("/reports", reportData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Update report
export const updateReport = async (id, reportData) => {
  try {
    const res = await api.put(`/reports/${id}`, reportData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete report
export const deleteReport = async (id) => {
  try {
    const res = await api.delete(`/reports/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
