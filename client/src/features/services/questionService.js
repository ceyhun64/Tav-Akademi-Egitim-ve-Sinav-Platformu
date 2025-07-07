import axiosInstance from "./axiosInstance";

export const get_teo_questions = async (examId) => {
  try {
    const response = await axiosInstance.get(`/question/teo/${examId}`);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
export const get_img_questions = async (examId) => {
  try {
    const response = await axiosInstance.get(`/question/img/${examId}`);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
export const get_both_questions_teo = async (examId) => {
  try {
    const response = await axiosInstance.get(`/question/both/teo/${examId}`);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
export const get_both_questions_img = async (examId) => {
  try {
    const response = await axiosInstance.get(`/question/both/img/${examId}`);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
export const answer_teo_questions = async (
  answers,
  examId,
  entry_date,
  entry_time,
  exit_date,
  exit_time
) => {
  try {
    const response = await axiosInstance.post("/question/answer/teo", {
      answers,
      examId,
      entry_date,
      entry_time,
      exit_date,
      exit_time,
    });
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
export const answer_img_questions = async (
  answers,
  examId,
  entry_date,
  entry_time,
  exit_date,
  exit_time
) => {
  try {
    const response = await axiosInstance.post("/question/answer/img", {
      answers,
      examId,
      entry_date,
      entry_time,
      exit_date,
      exit_time,
    });
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
