import axios from "axios";

// Backend URL
const baseURL = "http://localhost:5000";

// Upload file endpoint
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${baseURL}/api/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Analyze file endpoint
export const analyzeFile = async (payload) => {
  const response = await axios.post(`${baseURL}/api/analyze`, payload);
  return response.data;
};
