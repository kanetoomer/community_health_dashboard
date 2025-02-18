import axios from "axios";

// Backend URL
const baseURL = "https://community-health-dashboard-backend.onrender.com";

// Upload file endpoint
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${baseURL}/api/upload/csv`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Analyze file endpoint
export const analyzeFile = async (payload) => {
  const response = await axios.post(`${baseURL}/api/analyze`, payload);
  return response.data;
};
