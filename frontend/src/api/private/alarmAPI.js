import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 8000,
});

const requestError = (error) =>
  new Error(
    error.response?.data?.message ||
      (error.request
        ? "Could not reach the alarm server. Please try again."
        : error.message || "Unable to complete the alarm request."),
  );

export const fetchAlarmStatus = async (options = {}) => {
  try {
    const response = await api.get("/messageDetection/status", options);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    throw requestError(error);
  }
};

export const sendAlarmCommand = async (level) => {
  if (!["high", "medium", "clear"].includes(level)) {
    throw new Error("Invalid alarm command.");
  }
  try {
    const response = await api.post(`/messageDetection/alert/${level}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.status === "unavailable") {
      return error.response.data;
    }
    throw requestError(error);
  }
};
