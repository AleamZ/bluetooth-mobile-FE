import { IPromotion } from "@/types/promotion/promotion.interface";
import axiosInstance from "./main.service";

export const PromotionService = {
  createPromotion: async (formData: IPromotion) => {
    const response = await axiosInstance.post("/promotion/create", formData);
    return response.data;
  },
  getPromotionActive: async () => {
    const response = await axiosInstance.get("/promotion/get-active");
    return response.data;
  },
};
