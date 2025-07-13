import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// login api isteği
export const login = async (kullanici_adi, sifre) => {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      kullanici_adi,
      sifre,
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};
// adminLogin api isteği
export const adminLogin = async (kullanici_adi, sifre) => {
  try {
    const res = await axios.post(`${API_URL}/admin-login`, {
      kullanici_adi,
      sifre,
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

export const bulkRegister = async (formData) => {
  try {
    const res = await axiosInstance.post("/auth/bulk-register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res; // Sadece data kısmını döndür
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

export const uploadUserImages = async (formData) => {
  try {
    const res = await axiosInstance.post("/auth/upload-user-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

export const setup2FA = async ({ userId }) => {
  try {
    const res = await axios.post(`${API_URL}/setup-2fa`, { userId });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

export const verify2FA = async (userId, token) => {
  try {
    const res = await axiosInstance.post(`/auth/verify-2fa`, {
      userId,
      token,
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

// register api isteği
export const register = async (formData) => {
  try {
    const res = await axiosInstance.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: res.data,
      token: res.headers["x-auth-token"], // header'dan token
    };
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

// password güncellemek için mail gönderme api isteği
export const passwordEmail = async (email) => {
  try {
    const res = await axios.post(`${API_URL}/password-email`, { email });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

// password güncelleme api isteği
export const updatePassword = async (
  token,
  sifre,
  yenisifre,
  tekraryenisifre
) => {
  try {
    const res = await axios.put(`${API_URL}/update-password/${token}`, {
      sifre,
      yenisifre,
      tekraryenisifre,
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    const res = await axiosInstance.post("/auth/logout");
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};
