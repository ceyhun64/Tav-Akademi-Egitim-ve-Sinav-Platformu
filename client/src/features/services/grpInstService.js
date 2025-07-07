import axiosInstance from "./axiosInstance";

export const getGroups = async () => {
  try {
    const response = await axiosInstance.get("/grpinst/groups");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createGroup = async ({ name }) => {
  try {
    const response = await axiosInstance.post("/grpinst/groups", {
      name,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteGroup = async (id) => {
  try {
    const response = await axiosInstance.delete(`/grpinst/groups/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateGroup = async ({ id, name }) => {
  try {
    const response = await axiosInstance.put(`/grpinst/groups/${id}`, {
      name,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getInstitutions = async () => {
  try {
    const response = await axiosInstance.get("/grpinst/institutions");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createInstitution = async ({ name }) => {
  try {
    const response = await axiosInstance.post("/grpinst/institutions", {
      name,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteInstitution = async (id) => {
  try {
    const response = await axiosInstance.delete(`/grpinst/institutions/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateInstitution = async ({ id, name }) => {
  try {
    const response = await axiosInstance.put(`/grpinst/institutions/${id}`, {
      name,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
