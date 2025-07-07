import axiosInstance from "./axiosInstance";

export const getPracticeExam = async () => {
  try {
    const res = await axiosInstance.get("/practiceexam");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createPracticeExam = async (data) => {
  try {
    const res = await axiosInstance.post("/practiceexam", data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePracticeExam = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/practiceexam/${id}`, data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getQuestionsPracticeExam = async (examId) => {
  try {
    const res = await axiosInstance.get(`/practiceexam/question/${examId}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePracticeExam = async (id) => {
  try {
    const res = await axiosInstance.delete(`/practiceexam/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
