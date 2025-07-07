import axiosInstance from "./axiosInstance";

export const getBooklets = async () => {
  try {
    const response = await axiosInstance.get("/booklet");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getBookletByType = async (type) => {
  try {
    const response = await axiosInstance.get(`/booklet/type/${type}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getTeoBooklets = async () => {
  try {
    const response = await axiosInstance.get("/booklet/teo");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getImgBooklets = async () => {
  try {
    const response = await axiosInstance.get("/booklet/img");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getBookletById = async (id) => {
  try {
    const response = await axiosInstance.get(`/booklet/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createBooklet = async ({ name, type }) => {
  try {
    const response = await axiosInstance.post(`/booklet`, { name, type });
    return response;
  } catch (error) {
    console.error("Kitapçık oluşturma hatası:", error);
    throw error;
  }
};

export const updateBooklet = async (id, name) => {
  try {
    // name'i objeye sarmalıyoruz
    const response = await axiosInstance.put(`/booklet/${id}`, { name });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBooklet = async (id) => {
  try {
    const response = await axiosInstance.delete(`/booklet/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
