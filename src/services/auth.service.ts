import { LoginRequest } from "../types/login.interface";
import axiosInstance from "./main.service";

interface IFormRegister {
  username: string;
  email?: string | null;
  password: string;
  phone: string;
}
export const loginService = async (credentials: LoginRequest) => {
  const response = await axiosInstance.post("/login", credentials);
  return response.data;
};

export const register = async (data: IFormRegister) => {
  const response = await axiosInstance.post("/register", data);
  return response.data;
};
