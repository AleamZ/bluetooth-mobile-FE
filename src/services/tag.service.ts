import axiosInstance from "./main.service";

export const TagService = {
  getProposeTag: async (text: string) => {
    const response = await axiosInstance.get("/tag", {
      params: {
        text,
      },
    });
    return response.data;
  },
  createTag: async (formData: { tags: string[] }) => {
    const response = await axiosInstance.post("/tag/create", formData);
    return response.data;
  },
};
