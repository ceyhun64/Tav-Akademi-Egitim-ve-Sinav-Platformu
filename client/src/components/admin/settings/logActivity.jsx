import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLogActivityThunk } from "../../../features/thunks/logActivityThunk";
import Sidebar from "../adminPanel/sidebar";

export default function LogActivity() {
  const dispatch = useDispatch();
  const [groupedData, setGroupedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd formatında
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getLogActivityThunk());
  }, [dispatch]);

  const logData = useSelector((state) => state.logActivity.logActivity);

  useEffect(() => {
    if (logData && Array.isArray(logData)) {
      const grouped = logData.reduce((acc, item) => {
        const cat = item.category || "Diğer";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {});
      setGroupedData(grouped);
      setSelectedCategory(Object.keys(grouped)[0]);
    }
  }, [logData]);

  // Seçilen kategoriye göre logları filtrele
  const filteredLogs =
    groupedData[selectedCategory]?.filter((item) => {
      const itemDate = new Date(item.timestamp).setHours(0, 0, 0, 0);

      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    }) || [];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const selectWidth = 300;
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
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
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
            İşlem Kayıtları
          </h1>
        </div>
        {/* Kategori seçimi */}
        <div
          className="card shadow-sm"
          style={{
            maxWidth: "1200px", // genişliği artırdım
            width: "1100px", // genişliği tam ekran yapıyor
            margin: "0 auto", // ortaya hizalama
            borderRadius: "16px", // biraz daha yuvarlak köşeler
            padding: "2rem", // içerik için padding artırıldı
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)", // daha belirgin gölge
            backgroundColor: "#fff",
          }}
        >
          {" "}
          <div className="mb-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              aria-label="Kategori seçimi"
            >
              {Object.keys(groupedData).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Tarih filtreleri */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {/* Filtrelenmiş log tablosu */}
          {filteredLogs.length > 0 ? (
            <div
              className="table-responsive"
              style={{
                borderRadius: "16px",
                overflow: "auto",
                maxWidth: "1200px",
                maxHeight: "800px",
                boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                padding: "12px",
              }}
            >
              <table
                className="table align-middle table-hover"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                  minWidth: "100%", // %100 genişlik (mobilde sığmazsa yatay kaydırma)
                  userSelect: "none",
                  fontSize: isMobile ? "0.85rem" : "1rem",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#e9f1ff",
                    borderRadius: "12px",
                  }}
                >
                  <tr
                    className="text-center align-middle"
                    style={{ fontWeight: "600", color: "#334155" }}
                  >
                    <th
                      style={{
                        width: "40px",
                        padding: isMobile ? "6px" : "12px",
                      }}
                    >
                      #
                    </th>
                    <th style={{ padding: isMobile ? "6px" : "12px" }}>
                      Zaman
                    </th>
                    <th style={{ padding: isMobile ? "6px" : "12px" }}>
                      Aksiyon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((item, index) => (
                    <tr
                      key={item.id ? item.id : index}
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                        borderRadius: isMobile ? "6px" : "10px",
                        cursor: "default",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f4ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fff")
                      }
                    >
                      <td
                        className="text-center"
                        style={{
                          verticalAlign: "middle",
                          padding: isMobile ? "6px" : "12px",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          verticalAlign: "middle",
                          padding: isMobile ? "6px" : "12px",
                        }}
                      >
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          verticalAlign: "middle",
                          padding: isMobile ? "6px" : "12px",
                        }}
                      >
                        {item.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">Bu kategoriye ait log bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
