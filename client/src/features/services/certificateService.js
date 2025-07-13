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

export const getRequesters = async () => {
  try {
    const response = await axiosInstance.get("/certificate/requesters");
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const getEducators = async () => {
  try {
    const response = await axiosInstance.get("/certificate/educators");
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const getCourseNos = async () => {
  try {
    const response = await axiosInstance.get("/certificate/courseno");
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const getCourseTypes = async () => {
  try {
    const response = await axiosInstance.get("/certificate/coursetype");
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};


export const createRequester = async (data) => {
  try {
    const response = await axiosInstance.post("/certificate/requester", data);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const createEducator = async (data) => {
  try {
    const response = await axiosInstance.post("/certificate/educator", data);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const createCourseNo = async (data) => {
  try {
    const response = await axiosInstance.post("/certificate/courseno", data);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const createCourseType = async (data) => {
  try {
    const response = await axiosInstance.post("/certificate/coursetype", data);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};


export const deleteRequester = async (id) => {
  try {
    const response = await axiosInstance.delete(`/certificate/requester/${id}`);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const deleteEducator = async (id) => {
  try {
    const response = await axiosInstance.delete(`/certificate/educator/${id}`);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const deleteCourseNo = async (id) => {
  try {
    const response = await axiosInstance.delete(`/certificate/courseno/${id}`);
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
export const deleteCourseType = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/certificate/coursetype/${id}`
    );
    console.log("service:", response);
    return response;
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    throw error;
  }
};
