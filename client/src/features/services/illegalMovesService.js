import axiosInstance from "./axiosInstance";

export const getIllegalMoves = async () => {
  try {
    const res = await axiosInstance.get("/illegalmoves");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const addIllegalMoves = async (data) => {
  try {
    const res = await axiosInstance.post("/illegalmoves", data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteIllegalMoves = async (id) => {
  try {
    const res = await axiosInstance.delete(`/illegalmoves/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
