import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // backend URL
});

// Fetch live count
export const getLiveCount = () => API.get("/liveCount");

// Fetch logs
export const getLogs = async () => {
  const response = await API.get("/logs");
  return response.data;
};

