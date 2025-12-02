// services/dashboard.service.ts

import { DeleteCategoryRequest } from "../types/dashboard.interface";
import axiosInstance from "./main.service";

interface ProductFilterPayload {
  page: number;
  limit: number;
  searchName?: string;
  categoryId?: string;
  sort?: 'PRICE_ASC' | 'PRICE_DESC' | 'DATE_ASC' | 'DATE_DESC';
  status?: 'ACTIVE' | 'INACTIVE';
}

interface ApiProduct {
  _id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  stock: number;
  variants: Array<{
    _id: string;
    salePrice: number;
    stock: number;
    attributes: Record<string, string>;
  }>;
}

interface ProductResponse {
  [x: string]: any;
  statusCode: number;
  message: string;
  data: {
    products: Array<ApiProduct>;
    pagination: {
      [x: string]: number;
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    }
  };
}

export const DashboardService = {
  //-------------Category service-------------//
  getAllCategoriesActive: async () => {
    const response = await axiosInstance.get("category/get-active");
    return response.data;
  },
  updateCategory: async (data: any) => {
    const response = await axiosInstance.put("category/update", data);
    return response.data;
  },
  createCategory: async (payload: any) => {
    const response = await axiosInstance.post(`/category/create`, payload);
    return response.data;
  },
  deleteCategory: async (payload: DeleteCategoryRequest) => {
    const response = await axiosInstance.put(`/category/delete-soft`, payload);
    return response.data;
  },
  addSubCategory: async (parentId: string, subCategories: string[]) => {
    const response = await axiosInstance.post(`/category/add-sub/${parentId}`, {
      subCategories,
    });
    return response.data;
  },
  getCategorybyId: async (id: string) => {
    const response = await axiosInstance.get(`/category/get-category/${id}`);
    return response.data;
  },
  //--------------------------------------------//
  //-------------Overview service-------------//
  getOverview: async () => {
    const response = await axiosInstance.get("/statistical/orders");
    return response.data;
  },
  //--------------------------------------------//

  getProducts: async () => {
    const response = await axiosInstance.get("/product/get-all");
    return response.data;
  },
  getProductsWithFill: async (filters: ProductFilterPayload) => {
    const response = await axiosInstance.get("/product/get-with-fill", {
      params: filters
    });
    return response.data as ProductResponse;
  },
};
