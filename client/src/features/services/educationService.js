import axiosInstance from "./axiosInstance";

export const getAllEducations = async () => {
  try {
    const res = await axiosInstance.get("/education");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getEducationById = async (id) => {
  try {
    const res = await axiosInstance.get(`/education/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getEducationByEducationSetId = async (id) => {
  try {
    const res = await axiosInstance.get(`/edusetid/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const uploadSingleFile = async (formData) => {
  try {
    const res = await axiosInstance.post("/education/single", formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const addPageDuration = async (id, pages) => {
  try {
    const res = await axiosInstance.post(`/education/pages/${id}`, { pages });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getPageDuration = async (id) => {
  try {
    const res = await axiosInstance.get(`/education/pages/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const uploadMultipleFiles = async (formData) => {
  try {
    const res = await axiosInstance.post("/education/multiple", formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const deleteEducation = async (id) => {
  try {
    const res = await axiosInstance.delete(`/education/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const updateEducation = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/education/${id}`, formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const updateEducationUser = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/education/complete/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCompletedEducations = async () => {
  try {
    const response = await axiosInstance.get("/education/completed");
    return response;
  } catch (error) {
    throw error;
  }
};
