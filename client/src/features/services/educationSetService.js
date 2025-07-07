// services/educationSetService.js
import axiosInstance from "./axiosInstance";

export const createEducationSet = async (data) => {
  try {
    const response = await axiosInstance.post("/educationset", data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const assignUsersToEducationSet = async (data) => {
  try {
    const response = await axiosInstance.post("/educationset/assign", data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAllEducationSets = async () => {
  try {
    const response = await axiosInstance.get("/educationset");
    return response;
  } catch (error) {
    throw error;
  }
};
export const getEducationSetById = async (id) => {
  try {
    const response = await axiosInstance.get(`/educationset/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getEducationSetsUser = async () => {
  try {
    const response = await axiosInstance.get("/educationset/user");
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteEducationSet = async (id) => {
  try {
    const response = await axiosInstance.delete(`/educationset/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const updateEducationSet = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/educationset/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const updateEducationSetUser = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/educationset/complete/${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCompletedEducationSets = async () => {
  try {
    const response = await axiosInstance.get("/educationset/completed");
    return response;
  } catch (error) {
    throw error;
  }
};
