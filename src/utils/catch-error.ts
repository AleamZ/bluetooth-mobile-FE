import { message } from "antd";

export const handleError = (error: any) => {
  if (error?.errors?.length) {
    error.errors.map((err: any) => {
      return message.error(err);
    });
  }
  if (error?.message) {
    return message.error(error.message);
  }
  return message.error("Có lỗi xảy ra khi thực hiện yêu cầu.");
};
