import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const UploadService = {
  uploadSingle: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`${baseUrl}/upload/single`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    const response = await axios.post(`${baseUrl}/upload/multiple`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
};
