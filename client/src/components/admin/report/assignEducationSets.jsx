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
import ExportToExcel from "./exportAssignEduSet";

export default function AssignEducationSets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Using assignEducationSets from your Redux state
  const { assignEducationSets } = useSelector((state) => state.report);
  console.log("assignedusets:", assignEducationSets);

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
  const filteredResults = assignEducationSets.filter((item) =>
    String(item.EducationSet.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
  const handleDelete = (educationSetId, userId) => {
    if (
      window.confirm("Bu eğitim setini silmek istediğinizden emin misiniz?")
    ) {
      dispatch(deleteAssignEducationSetThunk({ educationSetId, userId }))
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
            className=" mt-2 ms-5"
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
        {/* Arama ve Butonlar Container */}
        <div
          className="d-flex flex-wrap align-items-center justify-content-between mb-3"
          style={{ gap: "0.75rem" }}
        >
          {/* Eğitim Seti Ara Input */}
          <input
            type="text"
            placeholder="Eğitim Seti ara..."
            className="form-control"
            style={{
              flex: "1 1 280px", // Genişlik minimum 280px, büyüyebilir
              minWidth: "200px",
              maxWidth: "400px",
            }}
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
              <thead style={{ backgroundColor: "#e9f1ff" }}>
                <tr className="text-center">
                  <th>Seç</th>
                  <th>Eğitim Seti</th>
                  <th>Kullanıcı</th>
                  {/* isMobile ise gizle */}
                  {!isMobile && <th>Eğitmen</th>}
                  {/* isMobile veya isTablet ise Başlangıç ve Bitiş tarihlerini gizle */}
                  {!isMobile && !isTablet && <th>Başlangıç Tarihi</th>}
                  {!isMobile && !isTablet && <th>Bitiş Tarihi</th>}
                  {!isMobile && <th>Tamamlandı</th>}
                  <th>İşlem</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((item, index) => (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.educationSetId)}
                        onChange={() =>
                          handleCheckboxChange(item.educationSetId)
                        }
                      />
                    </td>
                    <td>{item.EducationSet?.name || "–"}</td>
                    <td>
                      {item.user ? `${item.user.ad} ${item.user.soyad}` : "–"}
                    </td>

                    {!isMobile && <td>{item.educator || "-"}</td>}
                    {!isMobile && !isTablet && <td>{item.start_date}</td>}
                    {!isMobile && !isTablet && <td>{item.end_date}</td>}
                    {!isMobile && (
                      <td>
                        {item.completed ? (
                          <span className="badge bg-success">Evet</span>
                        ) : (
                          <span className="badge bg-secondary">Hayır</span>
                        )}
                      </td>
                    )}
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(item.educationSetId, item.userId)
                        }
                      >
                        Sil
                      </button>
                    </td>
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
