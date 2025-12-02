import axiosInstance from "./main.service";

export const BlogService = {
  createBlog: async (formData: any) => {
    const response = await axiosInstance.post("/blog/create", formData);
    return response.data;
  },
  getBlogsByCategoryNews: async () => {
    const response = await axiosInstance.get("/blog/get-all");
    return response.data;
  },
  getBlogById: async (id: string) => {
    const response = await axiosInstance.get(`/blog/${id}`);
    return response.data;
  }
};
