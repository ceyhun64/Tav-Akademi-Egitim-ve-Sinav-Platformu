import axiosInstance from "./axiosInstance";

export const getAllUserTeoResults = async () => {
  try {
    const response = await axiosInstance.get("/report/teo-result");
    return response;
  } catch (error) {
    console.error("Teorik sınav cevaplarını alırken hata:", error);
    throw error;
  }
};

export const getAllUserImgResults = async () => {
  try {
    const response = await axiosInstance.get("/report/img-result");
    return response;
  } catch (error) {
    console.error("Görsel sınav cevaplarını alırken hata:", error);
    throw error;
  }
};

export const getUserResultDetail = async (userId, examId) => {
  try {
    const response = await axiosInstance.get(
      `/report/result-detail/${userId}/${examId}`
    );
    return response;
  } catch (error) {
    console.error("Teorik sınav cevaplarını alırken hata:", error);
    throw error;
  }
};

export const getUserEducationResultDetail = async (userId, educationSetId) => {
  try {
    const response = await axiosInstance.get(
      `/report/education-result-detail/${userId}/${educationSetId}`
    );
    return response;
  } catch (error) {
    console.error("Eğitim seti sonuçlarını alırken hata:", error);
    throw error;
  }
};
export const getAllUserEducationSetsResult = async () => {
  try {
    const response = await axiosInstance.get("/report/education-set-result");
    return response;
  } catch (error) {
    console.error("Eğitim seti sonuçlarını alırken hata:", error);
    throw error;
  }
};

export const deleteUserExamResult = async (userExamIds) => {
  try {
    const response = await axiosInstance.delete("/report/delete-user-result", {
      data: { userExamIds },
    });
    return response;
  } catch (error) {
    console.error("Sınav sonucunu silerken hata:", error);
    throw error;
  }
};

export const deleteUserEducationResult = async (userEducationIds) => {
  try {
    const response = await axiosInstance.delete(
      "/report/delete-user-education-result",
      {
        data: { userEducationIds },
      }
    );
    return response;
  } catch (error) {
    console.error("Eğitim sonucunu silerken hata:", error);
    throw error;
  }
};

export const getQuestionCategoryResult = async (userId, examId) => {
  try {
    const response = await axiosInstance.get(
      `/report/question-category-result/${userId}/${examId}`
    );
    return response;
  } catch (error) {
    console.error("Soru kategorisi sonuçlarını alırken hata:", error);
    throw error;
  }
};

export const getImgQuestionResult = async (userId, examId) => {
  try {
    const response = await axiosInstance.get(
      `/report/img-question-result/${userId}/${examId}`
    );
    return response;
  } catch (error) {
    console.error("Görsel soru sonuçlarını alırken hata:", error);
    throw error;
  }
};

export const getTeoQuestionResult = async (userId, examId) => {
  try {
    const response = await axiosInstance.get(
      `/report/teo-question-result/${userId}/${examId}`
    );
    return response;
  } catch (error) {
    console.error("Teorik soru sonuçlarını alırken hata:", error);
    throw error;
  }
};
export const getUserImgExamResult = async () => {
  try {
    const response = await axiosInstance.get(`/report/user-img-result`);
    return response;
  } catch (error) {
    console.error("Görsel sınav sonuçlarını alırken hata:", error);
    throw error;
  }
};
export const getUserTeoExamResult = async () => {
  try {
    const response = await axiosInstance.get(`/report/user-teo-result`);
    return response;
  } catch (error) {
    console.error("Teorik sınav sonuçlarını alırken hata:", error);
    throw error;
  }
};

export const getAssignExams = async () => {
  try {
    const response = await axiosInstance.get(`/report/assign-exams`);
    return response;
  } catch (error) {
    console.error("Görsel sınavları alırken hata:", error);
    throw error;
  }
};
export const deleteAssignExam = async (examId) => {
  try {
    const response = await axiosInstance.delete(
      `/report/delete-assign-exam/${examId}`
    );
    console.log("response:", response);
    return response;
  } catch (error) {
    console.error("Görsel sınavı silerken hata:", error);
    throw error;
  }
};

export const getAssignEducationSets = async () => {
  try {
    const response = await axiosInstance.get(`/report/assign-education-sets`);
    return response;
  } catch (error) {
    console.error("Eğitim setlerini alırken hata:", error);
    throw error;
  }
};
export const deleteAssignEducationSet = async (educationSetId, userId) => {
  try {
    const response = await axiosInstance.delete(
      `/report/delete-assign-education-set/${educationSetId}/${userId}`
    );
    return response;
  } catch (error) {
    console.error("Eğitim setini silerken hata:", error);
    throw error;
  }
};

export const exportTeoReportToExcel = async () => {
  try {
    const res = await axiosInstance.post(
      "/report/excel-teo",
      {},
      {
        responseType: "blob", // Excel dosyası olarak dönecek
      }
    );
    // Blob'u URL'ye çevir
    const url = window.URL.createObjectURL(new Blob([res.data]));
    // Link oluştur ve tıkla
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "teoReport.xlsx"); // İndirilecek dosya adı
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Excel dışa aktarma hatası:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const exportImgReportToExcel = async () => {
  try {
    const res = await axiosInstance.post(
      "/report/excel-img",
      {},
      {
        responseType: "blob", // Excel dosyası olarak dönecek
      }
    );
    // Blob'u URL'ye çevir
    const url = window.URL.createObjectURL(new Blob([res.data]));
    // Link oluştur ve tıkla
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "uygReport.xlsx"); // İndirilecek dosya adı
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Excel dışa aktarma hatası:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const exportAssignTeoToExcel = async () => {
  try {
    const res = await axiosInstance.post(
      "/report/excel-assign-teo",
      {},
      {
        responseType: "blob", // Excel dosyası olarak dönecek
      }
    );
    // Blob'u URL'ye çevir
    const url = window.URL.createObjectURL(new Blob([res.data]));
    // Link oluştur ve tıkla
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "teoExams.xlsx"); // İndirilecek dosya adı
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Excel dışa aktarma hatası:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};

export const exportAssignImgToExcel = async () => {
  try {
    const res = await axiosInstance.post(
      "/report/excel-assign-img",
      {},
      {
        responseType: "blob", // Excel dosyası olarak dönecek
      }
    );
    // Blob'u URL'ye çevir
    const url = window.URL.createObjectURL(new Blob([res.data]));
    // Link oluştur ve tıkla
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "imgExams.xlsx"); // İndirilecek dosya adı
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Excel dışa aktarma hatası:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
export const exportAssignEduSetsToExcel = async () => {
  try {
    const res = await axiosInstance.post(
      "/report/excel-education-sets",
      {},
      {
        responseType: "blob", // Excel dosyası olarak dönecek
      }
    );
    // Blob'u URL'ye çevir
    const url = window.URL.createObjectURL(new Blob([res.data]));
    // Link oluştur ve tıkla
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "eduSets.xlsx"); // İndirilecek dosya adı
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Excel dışa aktarma hatası:", error);
    throw error.response?.data?.message || "Bir hata oluştu";
  }
};
