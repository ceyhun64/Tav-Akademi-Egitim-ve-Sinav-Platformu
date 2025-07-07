// services/imageGalleryService.js
import axiosInstance from "./axiosInstance";

//kategorileri listele
export const getImageGalleryCategory = async () => {
  try {
    const res = await axiosInstance.get("/galleryCat");
    console.log("service:", res);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//alt kategorileri listele
export const getImageGallerySubCategory = async () => {
  try {
    const res = await axiosInstance.get("/galleryCat/sub");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//alt kategorileri listele
export const getImageGallerySubCategoryByCategory = async (imageCatId) => {
  try {
    const res = await axiosInstance.get(`/galleryCat/sub/${imageCatId}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//kategori oluştur
export const createImageGalleryCategory = async (name) => {
  try {
    const res = await axiosInstance.post("/galleryCat", name);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//alt kategori oluştur
export const createImageGallerySubCategory = async (categoryData) => {
  try {
    const res = await axiosInstance.post("/galleryCat/sub", {categoryData});
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//kategori sil
export const deleteImageGalleryCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`/galleryCat/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//alt kategori sil
export const deleteImageGallerySubCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`/galleryCat/sub/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//kategori güncelle
export const updateImageGalleryCategory = async (id, name) => {
  try {
    const res = await axiosInstance.put(`/galleryCat/${id}`, { name });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

//alt kategori güncelle
export const updateImageGallerySubCategory = async (id, name, imageCatId) => {
  try {
    const res = await axiosInstance.put(`/galleryCat/sub/${id}`, {
      name,
      imageCatId,
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
