import axios from "axios";

// Upload file endpoint (adjust the URL as needed)
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(
    "http://localhost:5000/api/upload/csv",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data; // Should include filePath
};

// Analyze file endpoint (adjust the URL as needed)
// Now accepts an object containing filePath, cleaningOptions, and filters
export const analyzeFile = async (payload) => {
  const response = await axios.post(
    "http://localhost:5000/api/analyze",
    payload
  );
  return response.data;
};
