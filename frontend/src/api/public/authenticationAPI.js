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
    const errorObj = new Error(error.response.data.message || "Server error");
    errorObj.response = error.response;
    throw errorObj;
  } else if (error.request) {
    throw new Error("Server not responding");
  } else {
    throw new Error("Unexpected error occurred");
  }
};

// REGISTER
export const registerUser = async ({
  first_name,
  last_name,
  email,
  contact,
  password,
  consent_accepted = true,
  consent_version = "1.0",
}) => {
  try {
    const res = await api.post("/login/register", {
      first_name,
      last_name,
      email,
      contact,
      password,
      consent_accepted,
      consent_version,
    });
    return res.data;
  } catch (error) {
    console.error("Register API error:", error.message);
    handleError(error);
  }
};

// LOGIN
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/login/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("Login API error:", error.message);
    handleError(error);
  }
};

// GET CURRENT PUBLIC PROFILE
export const getPublicProfile = async () => {
  try {
    const res = await api.get("/login/me");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// CHANGE PASSWORD
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const res = await api.put("/login/changePassword", {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// LOGOUT (clears HttpOnly cookie + localStorage state)
export const logoutUser = async () => {
  try {
    await api.post("/login/logout");
  } catch {
    // Proceed with local cleanup even if network call fails
  } finally {
    clearAuthData("public");
  }
};

// CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  return checkIsAuthenticated("public");
};

// GET TOKEN (returns null since JWT is in HttpOnly cookie)
export const getToken = () => {
  return authGetToken("public");
};
