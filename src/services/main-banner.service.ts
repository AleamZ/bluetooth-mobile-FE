import axiosInstance from "./main.service";

export const MainBannerService = {
  deleteMainBanner: async (id: string) => {
    const response = await axiosInstance.delete(`/main-banner/delete/${id}`);
    return response.data;
  },
  updateMainBanner: async (id: string, payload: any) => {
    const response = await axiosInstance.put(
      `/main-banner/update/${id}`,
      payload
    );
    return response.data;
  },
  createMainBanner: async (data: any) => {
    const response = await axiosInstance.post("/main-banner/create", data);
    return response.data;
  },
  getAllMainBanners: async () => {
    const response = await axiosInstance.get("/main-banner/get-all");
    return response.data;
  },
  getIsShowBanner: async () => {
    const response = await axiosInstance.get("/main-banner/is-show");
    return response.data;
  },
  updateOrder: async (id: string, order: number) => {
    const response = await axiosInstance.put(
      `/main-banner/update-order/${id}`,
      {
        order,
      }
    );
    return response.data;
  },
};
