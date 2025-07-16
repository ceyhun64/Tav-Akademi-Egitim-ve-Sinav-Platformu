import axiosInstance from "./axiosInstance";

export const getBanSubs = async () => {
  try {
    const response = await axiosInstance.get("/bansubs");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteBanSubs = async (id) => {
  try {
    const response = await axiosInstance.delete(`/bansubs/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createBanSubs = async ({ name }) => {
  try {
    const response = await axiosInstance.post("/bansubs", {
      name,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateBanSubs = async ({ id, name }) => {
  try {
    console.log(id, name);  
    const response = await axiosInstance.put(`/bansubs/${id}`, {
      name,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
