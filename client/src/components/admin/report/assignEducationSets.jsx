import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Assuming you have specific thunks for education sets
// You might need to adjust these imports based on your actual Redux setup
import {
  getAssignEducationSetsThunk, // Example thunk to fetch education sets
  deleteAssignEducationSetThunk, // Example thunk to delete an education set
} from "../../../features/thunks/reportThunk"; // Adjust path as necessary
import Sidebar from "../adminPanel/sidebar"; // Assuming you have this component

export default function AssignEducationSets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Using assignEducationSets from your Redux state
  const { assignEducationSets } = useSelector((state) => state.report);

  // State for mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Assuming sidebar state is managed similarly

  // Fetch education sets on component mount
  useEffect(() => {
    dispatch(getAssignEducationSetsThunk()); // Dispatch your specific thunk
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");

  // Seçilen sınav id'leri (checkbox)
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtrelenmiş sınavlar (arama ile)
  const filteredResults = assignEducationSets.filter((exam) =>
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

  // Handle deletion of an education set
  const handleDelete = (eduSetId) => {
    if (
      window.confirm("Bu eğitim setini silmek istediğinizden emin misiniz?")
    ) {
      dispatch(deleteAssignEducationSetThunk(eduSetId)) // Use the specific delete thunk
        .unwrap()
        .then(() => {
          alert("Eğitim seti başarıyla silindi!");
          dispatch(getAssignEducationSetsThunk()); // Refresh list
        })
        .catch((error) => {
          console.error("Eğitim seti silme hatası:", error);
          alert("Eğitim seti silinirken bir hata oluştu: " + error.message);
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
      {/* Sidebar - Retained from previous context */}
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

      {/* Main Content Area */}
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
            Atanan Eğitim Setleri
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
        {/* Arama ve Toplu Seçim Alanı */}
        <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
          <input
            type="text"
            placeholder="Sınav adıyla ara..."
            className="form-control"
            style={{
              maxWidth: "280px",
              marginBottom: isMobile ? "0.75rem" : "0.5rem",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Tablet ve üstü: buton sağda */}
          {!isMobile && (
            <div>
              <button
                className="btn btn-danger btn-sm ms-3"
                onClick={handleBulkDelete}
              >
                Seçilenleri Sil
              </button>
            </div>
          )}

          {/* Mobil: buton altta ve tam genişlik */}
          {isMobile && (
            <div style={{ width: "100%" }}>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleBulkDelete}
              >
                Seçilenleri Sil
              </button>
            </div>
          )}
        </div>

        {/* Table Container with new styling */}
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
          {assignEducationSets && assignEducationSets.length > 0 ? (
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
                  {/* ✅ Sadece bir checkbox sütunu */}
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

                  {isMobile ? (
                    <>
                      <th style={{ padding: "6px 8px" }}>Set Adı</th>
                      <th style={{ padding: "6px 8px" }}>Teorik Sınav</th>
                      <th style={{ padding: "6px 8px" }}>Uyg. Sınav</th>
                    </>
                  ) : isTablet ? (
                    [
                      { header: "Eğitim Seti Adı", width: "35%" },
                      { header: "Teorik Sınav ID", width: "20%" },
                      { header: "Uygulamalı Sınav ID", width: "20%" },
                      { header: "Tarih", width: "15%" },
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
                      { header: "Eğitim Seti Adı", width: "25%" },
                      { header: "Teorik Sınav ID", width: "15%" },
                      { header: "Uygulamalı Sınav ID", width: "15%" },
                      { header: "Oluşturulma Tarihi", width: "15%" },
                      { header: "İşlemler", width: "25%" },
                    ].map((col, i) => (
                      <th
                        key={i}
                        className="text-center"
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
                {assignEducationSets.map((eduSet) => (
                  <tr
                    key={eduSet.id}
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
                    {/* ✅ Sadece bir checkbox hücresi */}
                    <td style={{ padding: "6px 8px", verticalAlign: "middle" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(eduSet.id)}
                        onChange={() => handleCheckboxChange(eduSet.id)}
                      />
                    </td>

                    {isMobile ? (
                      <>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {eduSet.name || "-"}
                        </td>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {eduSet.teoExamId || "-"}
                        </td>
                        <td style={{ textAlign: "center", padding: "6px 8px" }}>
                          {eduSet.imgExamId || "-"}
                        </td>
                      </>
                    ) : isTablet ? (
                      <>
                        <td style={{ padding: "6px 8px" }}>{eduSet.name}</td>
                        <td style={{ padding: "6px 8px" }}>
                          {eduSet.teoExamId}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {eduSet.imgExamId}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {new Date(eduSet.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(eduSet.id)}
                          >
                            Sil
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "6px 8px" }}>{eduSet.id}</td>
                        <td style={{ padding: "6px 8px" }}>{eduSet.name}</td>
                        <td style={{ padding: "6px 8px" }}>
                          {eduSet.teoExamId}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {eduSet.imgExamId}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {new Date(eduSet.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(eduSet.id)}
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
            <p className="text-center mt-5">Atanmış eğitim seti bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
