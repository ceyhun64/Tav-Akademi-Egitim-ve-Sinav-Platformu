import axiosInstance from "./axiosInstance";

export const getUserDetails = async (id) => {
  try {
    const res = await axiosInstance.get(`/user/details/${id}`);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get("/user");
    console.log("Tüm kullanıcılar:", res);
    console.log("Tüm kullanıcılar:", res.data);
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const updateUserDetails = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/user/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const deleteUsers = async (userIds) => {
  try {
    console.log("Silinecek kullanıcılar service:", userIds);
    const res = await axiosInstance.delete("/user", {
      data: { userIds },
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const aktifPasifUser = async (userIds, durum) => {
  try {
    console.log("Aktif pasif kullanıcılar:", userIds, durum);
    const res = await axiosInstance.put("/user/aktifpasif", {
      userIds,
      durum,
    });
    return res;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
