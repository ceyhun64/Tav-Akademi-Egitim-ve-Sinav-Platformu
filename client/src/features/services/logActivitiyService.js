import axiosInstance from "./axiosInstance";
export const getLogActivity = async () => {
  try {
    const response = await axiosInstance.get("/logactivity");
    return response;
  } catch (error) {
    throw error;
  }
};
