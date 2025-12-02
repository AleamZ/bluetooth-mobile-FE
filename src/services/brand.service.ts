import axiosInstance from "./main.service"

export const BrandService = {
    getAllBrands: async () => {
        const response = await axiosInstance.get("/brand/get-all")
        return response.data
    },
    getBrandActive: async () => {
        const response = await axiosInstance.get("/brand/get-active")
        return response.data
    },
    createBrand: async (payload: any) => {
        const response = await axiosInstance.post("/brand/create", payload)
        return response.data
    },
    updateBrand: async (payload: any) => {
        const response = await axiosInstance.put("/brand/update", payload)
        return response.data
    },
    deleteBrand: async (ids: any) => {
        const response = await axiosInstance.put(`/brand/delete-soft?ids=${ids}`)
        return response.data
    },
}