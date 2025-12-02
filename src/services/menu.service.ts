import axiosInstance from "./main.service";

export const MenuService= {
    getMenu: async () => {
        const response = await axiosInstance.get("/category/get-format-menu");
        return response.data;
    },

    updateMenuOrder: async (itemUrl: string, order: number) => {
        const response = await axiosInstance.put(`/category/update-order/${itemUrl}`, {order})
        return response.data
    }
}