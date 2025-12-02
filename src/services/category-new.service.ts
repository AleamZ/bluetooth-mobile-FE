import axiosInstance from "./main.service";

export const CategoryNewService = {
  getCategoriesNewActive: async () => {
    const response = await axiosInstance.get("/category-new/get-active");
    return response.data;
  },
};
