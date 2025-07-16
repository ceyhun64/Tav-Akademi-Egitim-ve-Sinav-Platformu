import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAssignImgExamsThunk, // Assuming this is the correct thunk for image exams
  deleteAssignExamThunk, // Re-using the delete thunk, adjust if specific for image exams
} from "../../../features/thunks/reportThunk";
import Sidebar from "../adminPanel/sidebar";

export default function AssignImgExams() {
  // Changed component name to reflect image exams
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignImgExams } = useSelector((state) => state.report); // Using assignImgExams from state

  // Mobil görünüm için sidebar state'leri
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Placeholder for checkbox functionality and filtered results (if needed, otherwise remove)
  // For this component, assuming no checkboxes are needed based on the provided table structure
  // If you need checkboxes for assignImgExams, you'll need to add selectedIds and handle functions.
  // const [selectedIds, setSelectedIds] = useState([]);
  // const filteredResults = assignImgExams;

  // Sınav verilerini çekmek için useEffect
  useEffect(() => {
    dispatch(getAssignImgExamsThunk()); // Dispatching the correct thunk
  }, [dispatch]);

  // Mobil boyutlandırma için useEffect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Sınav silme işlemi
  const handleDelete = (examId) => {
    if (
      window.confirm("Bu sınav atamasını silmek istediğinizden emin misiniz?")
    ) {
      dispatch(deleteAssignExamThunk(examId)) // Re-using deleteAssignExamThunk
        .unwrap()
        .then(() => {
          dispatch(getAssignImgExamsThunk()); // Refresh list after deletion
          alert("Sınav ataması başarıyla silindi!");
        })
        .catch((error) => {
          console.error("Sınav silme hatası:", error);
          alert("Sınav silinirken bir hata oluştu: " + error.message);
        });
    }
  };

  return (
    <div
      className="poolImg-container"
      style={{ overflowX: "hidden", padding: "1rem" }}
    >
      {/* Sidebar */}
      <div
        style={{
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{ marginLeft: isMobile ? "0px" : "260px", padding: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <h1
            className="mb-4 mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
            }}
          >
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: "1.6rem" }}
              ></i>
            )}
            Atanan Uygulamalı Sınavlar
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "30px",
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px", // padding yatay biraz artırıldı
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap", // metnin tek satırda kalmasını sağlar
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>

        {/* Tablo */}
        <div
          className="table-responsive"
          style={{
            borderRadius: "16px",
            overflowX: "hidden", // Prevent horizontal scrolling
            maxWidth: "100%", // Take full width
            maxHeight: "800px",
            boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            padding: "8px",
          }}
        >
          {assignImgExams && assignImgExams.length > 0 ? (
            <table
              className="table align-middle table-hover" // Added align-middle and table-hover classes
              style={{
                borderCollapse: "separate",
                borderSpacing: "0 6px",
                width: "100%",
                fontSize: "12px",
                userSelect: "none",
                tableLayout: "fixed", // Distribute columns equally
                textAlign: "center", // <-- EKLENDİ
              }}
            >
              <thead
                style={{ backgroundColor: "#e9f1ff", borderRadius: "12px" }}
              >
                <tr
                  className="text-center align-middle"
                  style={{ fontWeight: "600", color: "#334155" }}
                >
                  {/* No checkbox for assignImgExams in the provided original markup, so not adding here */}
                  {/* If you need one, you'll need to add selectedIds state and handle functions */}

                  {/* Table Headers based on mobile/desktop view */}
                  {isMobile ? (
                    <>
                      <th style={{ padding: "6px 8px" }}>Sınav Adı</th>
                      <th style={{ padding: "6px 8px" }}>Başlangıç</th>
                      <th style={{ padding: "6px 8px" }}>Süre (dk)</th>
                    </>
                  ) : (
                    [
                      { header: "ID", width: "5%" },
                      { header: "Sınav Adı", width: "20%" },
                      { header: "Başlangıç Tarihi", width: "12%" },
                      { header: "Başlangıç Saati", width: "10%" },
                      { header: "Bitiş Tarihi", width: "12%" },
                      { header: "Bitiş Saati", width: "10%" },
                      { header: "Süre (dk)", width: "8%" },
                      { header: "Geçme Notu", width: "8%" },
                      { header: "Soru Sayısı", width: "8%" },
                      { header: "İşlemler", width: "7%" },
                    ].map((col, i) => (
                      <th
                        key={i}
                        className={
                          ["Süre (dk)", "Geçme Notu", "Soru Sayısı"].includes(
                            col.header
                          )
                            ? "text-end"
                            : "text-center"
                        }
                        style={{
                          whiteSpace: "nowrap",
                          padding: "6px 8px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: col.width,
                        }}
                        title={col.header}
                      >
                        {col.header}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {assignImgExams.map((exam) => (
                  <tr
                    key={exam.id}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      fontSize: "12px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                  >
                    {/* No checkbox for assignImgExams in the provided original markup, so not adding here */}

                    {isMobile ? (
                      <>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {exam.name || "-"}
                        </td>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {exam.start_date || "-"}
                        </td>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {exam.sure ?? "-"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "6px 8px" }}>{exam.id}</td>
                        <td style={{ padding: "6px 8px" }}>{exam.name}</td>
                        <td style={{ padding: "6px 8px" }}>
                          {exam.start_date}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {exam.start_time}
                        </td>
                        <td style={{ padding: "6px 8px" }}>{exam.end_date}</td>
                        <td style={{ padding: "6px 8px" }}>{exam.end_time}</td>
                        <td className="text-end" style={{ padding: "6px 8px" }}>
                          {exam.sure}
                        </td>
                        <td className="text-end" style={{ padding: "6px 8px" }}>
                          {exam.passing_score}
                        </td>
                        <td className="text-end" style={{ padding: "6px 8px" }}>
                          {exam.question_count}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(exam.id)}
                          >
                            Sil
                          </button>
                          {/* Diğer işlemler (düzenleme vb.) buraya eklenebilir */}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center mt-5">
              Atanmış uygulamalı sınav bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
