import axios from "axios";

// Base API URL
const API_URL = "http://localhost:8000/api/";

// Upload file (CSV)
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}upload/`, formData);
};

// Fetch health data
export const fetchHealthData = () => axios.get(`${API_URL}healthdata/`);

// Generate PDF report
export const generateReport = () =>
  axios.get(`${API_URL}generate-report/`, { responseType: "blob" });
