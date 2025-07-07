import axiosInstance from "./axiosInstance";

export const uploadFile = async (formData) => {
  try {
    const response = await axiosInstance.post("/uploadfile", formData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const uploadMultipleFiles = async (formData) => {
  try {
    const response = await axiosInstance.post("/uploadfile/multiple", formData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getUploadedFilesByManager = async () => {
  try {
    const response = await axiosInstance.get("/uploadfile/manager");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getUploadedFilesByUser = async () => {
  try {
    const response = await axiosInstance.get("/uploadfile/user");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const deleteUploadedFile = async (ids) => {
  try {
    const response = await axiosInstance.delete("/uploadfile/", {
      data: { ids },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateDownloaded = async (fileId) => {
  try {
    const response = await axiosInstance.put("/uploadfile/downloaded", {
      fileId,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDownloadedUser = async () => {
  try {
    const response = await axiosInstance.get("/uploadfile/downloaded");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
