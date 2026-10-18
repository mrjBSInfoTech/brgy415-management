import axios from "axios";

// Axios instance (centralized config)
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Centralized error handler
const handleError = (error) => {
  if (error.response) {
    // Backend responded with an error
    const errorObj = new Error(error.response.data.message || "Server error");
    errorObj.response = error.response;
    throw errorObj;
  } else if (error.request) {
    // Request sent but no response
    throw new Error("Server not responding");
  } else {
    // Something else happened
    console.error("Request error:", error.message);
    throw new Error("Unexpected error occurred: " + error.message);
  }
};

// Interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("private_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// LOGOUT (frontend only)
export const logoutUser = () => {
  localStorage.removeItem("private_token");
  localStorage.removeItem("token");
  localStorage.removeItem("official_account_id");
  localStorage.removeItem("password_changed");
  localStorage.removeItem("username");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("position");
  localStorage.removeItem("image");
  localStorage.removeItem("account_type");
  localStorage.removeItem("can_add");
  localStorage.removeItem("can_edit");
  localStorage.removeItem("can_delete");
};

// CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  return !!localStorage.getItem("private_token");
};  

// GET TOKEN
export const getToken = () => {
  return localStorage.getItem("private_token");
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
