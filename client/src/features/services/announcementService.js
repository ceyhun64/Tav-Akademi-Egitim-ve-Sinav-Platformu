import axiosInstance from "./axiosInstance";

// Tüm duyuruları getir
export const getAnnouncements = async () => {
  try {
    const response = await axiosInstance.get("/announcement/");
    return response.data;
  } catch (error) {
    console.error("getAnnouncements error:", error);
    throw error;
  }
};

// Yeni duyuru oluştur
export const createAnnouncement = async ({
  institutionId,
  groupId,
  content,
}) => {
  try {
    const response = await axiosInstance.post("/announcement/", {
      institutionId,
      groupId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("createAnnouncement error:", error);
    throw error;
  }
};

// Duyuru sil
export const deleteAnnouncement = async (id) => {
  try {
    const response = await axiosInstance.delete(`/announcement/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteAnnouncement error:", error);
    throw error;
  }
};

// Duyuru güncelle
export const updateAnnouncement = async (
  id,
  { institutionId, groupId, content }
) => {
  try {
    const response = await axiosInstance.put(`/announcement/${id}`, {
      institutionId,
      groupId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("updateAnnouncement error:", error);
    throw error;
  }
};
