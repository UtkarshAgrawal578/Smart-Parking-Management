import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // backend URL
});

// Fetch live count
export const getLiveCount = () => API.get("/liveCount");



export const getStatus = () => axios.get("http://localhost:8000/api/status");

// Fetch logs
export const getLogs = async () => {
  const response = await API.get("/logs");
  return response.data;
};

