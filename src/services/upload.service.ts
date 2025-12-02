import axios from "axios";

const uploadUrl = import.meta.env.VITE_APP_UPLOAD_URL;

export const UploadService = {
  uploadSingle: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`${uploadUrl}/single`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    const response = await axios.post(`${uploadUrl}/multiple`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
};
