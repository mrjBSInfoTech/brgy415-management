import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";

// Create an Axios instance (you can set global options here)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // wait max 5 seconds
});

// Fetch all officials
export const fetchOfficials = async () => {
  try {
    const res = await api.get("/about");
    return res.data;
  } catch (error) {
    console.error("Error in fetchOfficials:", error);
    handleError(error);
  }
};

