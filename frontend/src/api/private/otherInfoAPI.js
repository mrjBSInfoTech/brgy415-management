import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000,
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

export const updateOtherInfo = async (id, formData) => {
  try {
    const res = await api.put(`/otherinfo/${id}`, formData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
