import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import {
  clearAuthData,
  getToken as authGetToken,
  isAuthenticated as checkIsAuthenticated,
} from "../../utils/auth";

// Axios instance (centralized config)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

// Centralized error handler
const handleError = (error) => {
  if (error.response) {
    const errorObj = new Error(
      error.response.data.message || error.response.data.error || "Server error"
    );
    errorObj.response = error.response;
    throw errorObj;
  } else if (error.request) {
    throw new Error("Server not responding");
  } else {
    console.error("Request error:", error.message);
    throw new Error("Unexpected error occurred: " + error.message);
  }
};

/* ============================
   AUTHENTICATION REQUESTS
============================ */

// LOGIN
export const loginUser = async ({ username, password }) => {
  try {
    const res = await api.post("/authentication/login", {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// GET CURRENT OFFICIAL PROFILE
export const getOfficialProfile = async () => {
  try {
    const res = await api.get("/authentication/me");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// LOGOUT (clears HttpOnly cookie + localStorage state)
export const logoutUser = async () => {
  try {
    await api.post("/authentication/logout");
  } catch {
    // Proceed with local cleanup even if network call fails
  } finally {
    clearAuthData("private");
  }
};

// CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  return checkIsAuthenticated("private");
};

// GET TOKEN (returns null since JWT is in HttpOnly cookie)
export const getToken = () => {
  return authGetToken("private");
};

// CHANGE PASSWORD
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const res = await api.put("/authentication/changePassword", {
      currentPassword,
      newPassword,
    });
    localStorage.setItem("private_password_changed", "1");
    window.dispatchEvent(new Event("private-password-changed"));
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
