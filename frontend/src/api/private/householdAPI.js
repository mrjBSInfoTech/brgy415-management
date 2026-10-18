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

// Fetch all households
export const fetchHouseholds = async () => {
  try {
    const res = await api.get("/households");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch single household by ID
export const fetchHouseholdById = async (id) => {
  try {
    const res = await api.get(`/households/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Add new household
export const createHousehold = async (householdData) => {
  try {
    const res = await api.post("/households", householdData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Bulk Add Households
export const bulkAddHouseholds = async (households) => {
  try {
    const res = await api.post("/households/bulk", { households });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Add new household (alias)
export const addHousehold = async (householdData) => {
  return createHousehold(householdData);
};

// Update household
export const updateHousehold = async (id, householdData) => {
  try {
    const res = await api.put(`/households/${id}`, householdData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete household
export const deleteHousehold = async (id) => {
  try {
    const res = await api.delete(`/households/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
