import axiosInstance from "./axiosInstance";

export const getQuestionCat = async () => {
  try {
    const response = await axiosInstance.get("/quedif");
    return response;
  } catch (error) {
    console.error("Soru kategorileri alınırken hata oluştu:", error);
    throw error;
  }
};
export const createQuestionCat = async (name) => {
  try {
    const response = await axiosInstance.post("/quedif", name);
    return response;
  } catch (error) {
    console.error("Soru kategorisi oluşturulurken hata oluştu:", error);
    throw error;
  }
};
export const deleteQuestionCat = async (id) => {
  try {
    const response = await axiosInstance.delete(`/quedif/${id}`);
    return response;
  } catch (error) {
    console.error("Soru kategorisi silinirken hata oluştu:", error);
    throw error;
  }
};
export const getDifLevels = async () => {
  try {
    const response = await axiosInstance.get("/quedif/dif");
    return response;
  } catch (error) {
    console.error("Soru kategorileri alınırken hata oluştu:", error);
    throw error;
  }
};
export const createDifLevel = async (name) => {
  try {
    const response = await axiosInstance.post("/quedif/dif", name);
    return response;
  } catch (error) {
    console.error("Soru kategorisi oluşturulurken hata oluştu:", error);
    throw error;
  }
};
export const deleteDifLevel = async (id) => {
  try {
    const response = await axiosInstance.delete(`/quedif/dif/${id}`);
    return response;
  } catch (error) {
    console.error("Soru kategorisi silinirken hata oluştu:", error);
    throw error;
  }
};
