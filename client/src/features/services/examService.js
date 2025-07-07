import axiosInstance from "./axiosInstance";

export const getExams = async () => {
  try {
    const res = await axiosInstance.get("/exam");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getExamById = async (examId) => {
  try {
    const res = await axiosInstance.get(`/exam/${examId}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const createTeoExam = async (formData) => {
  try {
    const res = await axiosInstance.post("/exam/teo", formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const createImgExam = async (formData) => {
  try {
    const res = await axiosInstance.post("/exam/img", formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const createUnifiedExam = async (formData) => {
  try {
    const res = await axiosInstance.post("/exam/both", formData);
    console.log("unified", res.data);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const deleteExam = async (examId) => {
  try {
    const res = await axiosInstance.delete(`/exam/${examId}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const getExamByUserId = async () => {
  try {
    const res = await axiosInstance.get("/exam/user");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const getUserTeoExams = async () => {
  try {
    const res = await axiosInstance.get("/exam/user/teo");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const getUserImgExams = async () => {
  try {
    const res = await axiosInstance.get("/exam/user/img");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const getUserUnifiedExams = async () => {
  try {
    const res = await axiosInstance.get("/exam/user/both");
  
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
