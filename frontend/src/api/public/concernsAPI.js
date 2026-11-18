import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import { isAuthenticated } from "../../utils/auth";

// Create an Axios instance (withCredentials sends HttpOnly cookies automatically)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

// Helper function to handle errors globally
const handleError = (error) => {
  if (error.response) {
    console.error("Server error:", error.response.status, error.response.data);
    const errorMsg =
      error.response.data.message ||
      error.response.data.error ||
      "Server responded with an error";
    throw new Error(errorMsg);
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

// Add new concern
export const addConcern = async (concernData) => {
  try {
    // Check if user is logged in
    if (!isAuthenticated("public")) {
      throw new Error("Please log in to submit a concern");
    }

    // Validate required fields
    if (!concernData.message_type || !concernData.message.trim()) {
      throw new Error("Please fill in all required fields");
    }

    const payload = {
      message_type: concernData.message_type,
      message: concernData.message,
    };

    const res = await api.post("/concerns", payload, {
      timeout: 25000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
