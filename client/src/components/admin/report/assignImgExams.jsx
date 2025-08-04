import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAssignExamsThunk, // Assuming this is the correct thunk for image exams
  deleteAssignExamThunk, // Re-using the delete thunk, adjust if specific for image exams
} from "../../../features/thunks/reportThunk";
import Sidebar from "../adminPanel/sidebar";
import ExportToExcel from "./exportAssignImg";

export default function AssignImgExams() {
  // Changed component name to reflect image exams
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignExams } = useSelector((state) => state.report);

  // Mobil görünüm için sidebar state'leri
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Sınav verilerini çekmek için useEffect
  // Arama terimi (sınav adına göre filtre)
  const [searchTerm, setSearchTerm] = useState("");

  // Seçilen sınav id'leri (checkbox)
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtrelenmiş sınavlar (arama ile)
  const filteredResults = assignExams
    .filter((exam) => exam.exam_type === "img") // ← sadece img olanları filtrele
    .filter((exam) =>
      exam.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Tümünü seç / seçimi kaldır
  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredResults.length &&
      filteredResults.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResults.map((exam) => exam.id));
    }
  };

  // Tek bir checkbox değiştiğinde
  const handleCheckboxChange = (examId) => {
    setSelectedIds((prev) =>
      prev.includes(examId)
        ? prev.filter((id) => id !== examId)
        : [...prev, examId]
    );
  };

  useEffect(() => {
    dispatch(getAssignExamsThunk()); // Dispatching the correct thunk
  }, [dispatch]);

  // Mobil boyutlandırma için useEffect
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true); // büyük ekranlarda sidebar açık
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
          dispatch(getAssignExamsThunk()); // Refresh list after deletion
          alert("Sınav ataması başarıyla silindi!");
        })
        .catch((error) => {
          console.error("Sınav silme hatası:", error);
          alert("Sınav silinirken bir hata oluştu: " + error.message);
        });
    }
  };
  const handleBulkDelete = () => {
    if (
      selectedIds.length > 0 &&
      window.confirm("Seçili sınavları silmek istediğinize emin misiniz?")
    ) {
      Promise.all(
        selectedIds.map((id) => dispatch(deleteAssignExamThunk(id)).unwrap())
      )
        .then(() => {
          dispatch(getAssignTeoExamsThunk());
          alert("Seçilen sınavlar başarıyla silindi.");
          setSelectedIds([]);
        })
        .catch((err) => alert("Toplu silmede hata oluştu: " + err.message));
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
            marginBottom: "1rem",
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
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap",
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>

        {/* Arama ve Butonlar Yan Yana */}
        <div
          className="d-flex flex-wrap align-items-center justify-content-between mb-3"
          style={{ gap: "0.75rem" }}
        >
          <input
            type="text"
            placeholder="Sınav adıyla ara..."
            className="form-control"
            style={{ maxWidth: "280px", flexGrow: 1, minWidth: "200px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Butonlar Container */}
          <div
            className="d-flex flex-wrap"
            style={{ gap: "0.5rem", flex: "0 1 auto" }}
          >
            <button
              className="btn btn-danger btn-sm"
              onClick={handleBulkDelete}
              style={{ whiteSpace: "nowrap" }}
            >
              Seçilenleri Sil
            </button>

            <ExportToExcel />
          </div>
        </div>

        {/* Tablo */}
        <div
          className="table-responsive"
          style={{
            borderRadius: "16px",
            overflowX: "auto",
            maxWidth: "100%",
            maxHeight: "800px",
            boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            padding: "8px",
          }}
        >
          {filteredResults && filteredResults.length > 0 ? (
            <table
              className="table align-middle table-hover"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0 6px",
                width: "100%",
                fontSize: "12px",
                userSelect: "none",
                tableLayout: "fixed",
                textAlign: "center",
              }}
            >
              <thead
                style={{ backgroundColor: "#e9f1ff", borderRadius: "12px" }}
              >
                <tr
                  className="text-center align-middle"
                  style={{ fontWeight: "600", color: "#334155" }}
                >
                  {/* ✅ Checkbox sütunu başlığı — her cihazda */}
                  <th style={{ width: "3%", padding: "6px 8px" }} title="Seçim">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedIds.length === filteredResults.length &&
                        filteredResults.length > 0
                      }
                      id="selectAllCheckbox"
                    />
                  </th>

                  {/* Mobil görünüm başlıkları */}
                  {isMobile ? (
                    <>
                      <th style={{ padding: "6px 8px" }}>Sınav Adı</th>
                      <th style={{ padding: "6px 8px" }}>Süre</th>
                      <th style={{ padding: "6px 8px" }}>İşlemler</th>
                    </>
                  ) : isTablet ? (
                    [
                      { header: "Sınav Adı", width: "35%" },
                      { header: "Başlangıç Tarihi", width: "20%" },
                      { header: "Bitiş Tarihi", width: "20%" },
                      { header: "Süre (dk)", width: "10%" },
                      { header: "Geçme Notu", width: "10%" },
                      { header: "İşlemler", width: "10%" },
                    ].map((col, i) => (
                      <th
                        key={i}
                        style={{
                          whiteSpace: "nowrap",
                          padding: "6px 8px",
                          width: col.width,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={col.header}
                      >
                        {col.header}
                      </th>
                    ))
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
                {filteredResults.map((exam) => (
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
                    {/* ✅ Checkbox her cihazda görünsün */}
                    <td style={{ padding: "6px 8px", verticalAlign: "middle" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(exam.id)}
                        onChange={() => handleCheckboxChange(exam.id)}
                      />
                    </td>

                    {isMobile ? (
                      <>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {exam.name || "-"}
                        </td>
                     
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {exam.sure ?? "-"}
                        </td>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(exam.id)}
                          >
                            Sil
                          </button>
                        </td>
                      </>
                    ) : isTablet ? (
                      <>
                        <td style={{ padding: "6px 8px" }}>{exam.name}</td>
                        <td style={{ padding: "6px 8px" }}>
                          {exam.start_date}
                        </td>
                        <td style={{ padding: "6px 8px" }}>{exam.end_date}</td>
                        <td className="text-end" style={{ padding: "6px 8px" }}>
                          {exam.sure}
                        </td>
                        <td className="text-end" style={{ padding: "6px 8px" }}>
                          {exam.passing_score}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(exam.id)}
                          >
                            Sil
                          </button>
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
