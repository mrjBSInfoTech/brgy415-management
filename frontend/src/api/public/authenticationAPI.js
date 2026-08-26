import axios from "axios";

// Axios instance (centralized config)
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("public_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
    throw new Error("Unexpected error occurred");
  }
};

// REGISTER
export const registerUser = async ({ first_name, last_name, email, contact, password }) => {
  try {
    const res = await api.post("/login/register", {
      first_name,
      last_name,
      email,
      contact,
      password,
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

// LOGOUT (frontend only)
export const logoutUser = () => {
  localStorage.removeItem("public_token");
  localStorage.removeItem("public_email");
  localStorage.removeItem("public_first_name");
  localStorage.removeItem("public_last_name");
  localStorage.removeItem("public_contact");
  localStorage.removeItem("public_status");
  localStorage.removeItem("public_type");
  localStorage.removeItem("public_date_created");
  localStorage.removeItem("public_auth_section");
};

// CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  return !!localStorage.getItem("public_token");
};

// GET TOKEN
export const getToken = () => {
  return localStorage.getItem("public_token");
};
