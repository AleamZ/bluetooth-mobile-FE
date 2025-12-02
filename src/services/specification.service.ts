import axiosInstance from "./main.service";

export const SpecificationService = {
  createSpecification: async (data: any) => {
    const response = await axiosInstance.post("/specification/create", data);
    return response.data;
  },

  updateSpecification: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/specification/update/${id}`, data);
    return response.data;
  },

  deleteSpecification: async (id: string) => {
    const response = await axiosInstance.delete(`/specification/delete/${id}`);
    return response.data;
  },

  hardDeleteSpecification: async (id: string) => {
    const response = await axiosInstance.delete(`/specification/hard-delete/${id}`);
    return response.data;
  },

  getSpecificationsByUrl: async (categoryUrl: string) => {
    const response = await axiosInstance.get(
      `/specification/get-filter-category/${categoryUrl}`
    );
    return response.data;
  },

  getSpecifications: async (categoryId: string) => {
    const response = await axiosInstance.get(`/specification/${categoryId}`);
    return response.data;
  },
};
