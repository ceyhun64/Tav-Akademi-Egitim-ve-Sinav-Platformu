import axiosInstance from "./axiosInstance";

export const getPoolImgs = async () => {
  try {
    const res = await axiosInstance.get("/poolImg");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPoolImgById = async (id) => {
  try {
    const res = await axiosInstance.get(`/poolImg/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createPoolImg = async (formData) => {
  try {
    const res = await axiosInstance.post("/poolImg", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePoolImg = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/poolImg/${id}`, formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePoolImg = async (id) => {
  try {
    const res = await axiosInstance.delete(`/poolImg/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPoolImgsByBookletId = async (bookletId) => {
  try {
    const res = await axiosInstance.get(`/poolImg/booklet/${bookletId}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
