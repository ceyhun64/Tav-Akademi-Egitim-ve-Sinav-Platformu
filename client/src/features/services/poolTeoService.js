import axiosInstance from "./axiosInstance";

export const getPoolTeos = async () => {
  try {
    const res = await axiosInstance.get("/poolTeo");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPoolTeoById = async (id) => {
  try {
    const res = await axiosInstance.get(`/poolTeo/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createPoolTeo = async (formData) => {
  try {
    const res = await axiosInstance.post("/poolTeo", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const uploadQuestionsFromExcel = async (formData) => {
  try {
    const res = await axiosInstance.post("/poolTeo/upload-questions", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePoolTeo = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/poolTeo/${id}`, formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePoolTeo = async (id) => {
  try {
    const res = await axiosInstance.delete(`/poolTeo/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPoolTeosByBookletId = async (bookletId) => {
  try {
    const res = await axiosInstance.get(`/poolTeo/booklet/${bookletId}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

