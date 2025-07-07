import axiosInstance from "./axiosInstance";
export const getCompletedEducationSets = async (educationSetId) => {
  try {
    const response = await axiosInstance.get(
      `/certificate/complete/${educationSetId}`
    );
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const createCertificate = async (data) => {
  try {
    const response = await axiosInstance.post("/certificate", data, {
      responseType: "blob", // veya "arraybuffer"
    });
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};

export const getCertificates = async () => {
  try {
    const response = await axiosInstance.get("/certificate");
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
