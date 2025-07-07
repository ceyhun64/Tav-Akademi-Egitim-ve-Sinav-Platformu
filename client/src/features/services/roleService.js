import axiosInstance from "./axiosInstance";

export const getRoles = async () => {
  try {
    const res = await axiosInstance.get("/role");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createRole = async (formData) => {
  try {
    const res = await axiosInstance.post("/role", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateRole = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/role/${id}`, formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteRole = async (id) => {
  try {
    const res = await axiosInstance.delete(`/role/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getRoleLevels = async () => {
  try {
    const res = await axiosInstance.get("/role/role-level");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createRoleLevel = async (formData) => {
  try {
    const res = await axiosInstance.post("/role/role-level", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateRoleLevel = async (id, name, level) => {
  try {
    console.log("service:", id, name);
    const res = await axiosInstance.put(`/role/role-level/${id}`, {
      name,
      level,
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteRoleLevel = async (id) => {
  try {
    const res = await axiosInstance.delete(`/role/role-level/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPermissions = async () => {
  try {
    const res = await axiosInstance.get("/role/permissions");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getRoleLevelPerms = async (id) => {
  try {
    const res = await axiosInstance.get(`/role/role-level-perm/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createRoleLevelPerm = async (formData) => {
  try {
    const res = await axiosInstance.post("/role/role-level-perm", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateRoleLevelPerm = async (formData) => {
  try {
    const res = await axiosInstance.put("/role/role-level-perm", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const assignRoleToUser = async (formData) => {
  try {
    const res = await axiosInstance.put("/role/assign", formData);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
