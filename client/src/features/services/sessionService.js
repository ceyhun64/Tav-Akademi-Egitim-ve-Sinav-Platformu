import axiosInstance from "./axiosInstance";

export const getSessions = async () => {
  try {
    const response = await axiosInstance.get("/session");
    return response;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};
export const deactivateSession = async (sessionId) => {
  try {
    const response = await axiosInstance.put(
      `/session/deactivate/${sessionId}`
    );
    return response;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};
export const activateSession = async (sessionId) => {
  try {
    const response = await axiosInstance.put(`/session/activate/${sessionId}`);
    return response;
  } catch (error) {
    console.error("API'den veri çekerken hata oluştu:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }
};
