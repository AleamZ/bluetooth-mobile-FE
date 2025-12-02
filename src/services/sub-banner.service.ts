import axiosInstance from "./main.service";

export const SubBannerService = {
  deleteSubBanner: async (id: string) => {
    const response = await axiosInstance.delete(`/sub-banner/delete/${id}`);
    return response.data;
  },
  updateSubBanner: async (id: string, payload: any) => {
    const response = await axiosInstance.put(
      `/sub-banner/update/${id}`,
      payload
    );
    return response.data;
  },
  createSubBanner: async (data: any) => {
    const response = await axiosInstance.post("/sub-banner/create", data);
    return response.data;
  },
  getAllSubBanners: async () => {
    const response = await axiosInstance.get("/sub-banner/get-all");
    return response.data;
  },
  getIsShowBanner: async () => {
    const response = await axiosInstance.get("/sub-banner/is-show");
    return response.data;
  },
  updateOrder: async (id: string, order: number) => {
    const response = await axiosInstance.put(`/sub-banner/update-order/${id}`, {
      order,
    });
    return response.data;
  },
};
