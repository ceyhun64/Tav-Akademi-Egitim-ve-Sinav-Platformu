import axiosInstance from "./axiosInstance";

export const getAllGalleries = async () => {
  try {
    const res = await axiosInstance.get("/gallery");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const  getGalleryById = async (id) => {
  try {
    const res = await axiosInstance.get(`/gallery/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getGalleryByCategory = async (imageCatId) => {
  try {
    const res = await axiosInstance.get(`/gallery/cat/${imageCatId}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getGalleryBySubCategory = async (imageSubCatId) => {
  try {
    const res = await axiosInstance.get(`/gallery/sub/${imageSubCatId}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const uploadSingleImage = async (formData) => {
  try {
    const res = await axiosInstance.post("/gallery/single", formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const uploadMultipleImages = async (formData) => {
  try {
    const res = await axiosInstance.post("/gallery/multiple", formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const deleteGallery = async (id) => {
  try {
    const res = await axiosInstance.delete(`/gallery/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const updateGallery = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/gallery/${id}`, formData);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
