import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLogActivityThunk } from "../../../features/thunks/logActivityThunk";
import Sidebar from "../adminPanel/sidebar";

export default function LogActivity() {
  const dispatch = useDispatch();
  const [groupedData, setGroupedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
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
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Sidebar genişliğini responsive yapalım
  const sidebarWidth = isMobile ? 0 : isTablet ? 200 : 260;

  // İçerik margin-left responsive
  const contentMarginLeft = sidebarOpen ? sidebarWidth : 0;

  // Kart genişliği responsive
  const cardMaxWidth = isMobile ? "95%" : isTablet ? "800px" : "1200px";

  // Font size responsive
  const fontSize = isMobile ? "0.85rem" : "1rem";

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
        style={{
          marginLeft: contentMarginLeft,
          transition: "margin-left 0.3s ease",
          padding: isMobile ? "0.5rem" : "1rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? "1.5rem" : "2.5rem",
          }}
        >
          <h1
            className=" mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: isMobile ? "20px" : "28px",
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
                style={{ fontSize: isMobile ? "1.2rem" : "1.6rem" }}
              ></i>
            )}
            İşlem Kayıtları
          </h1>
        </div>

        {/* Kategori seçimi ve filtre kartı */}
        <div
          className="card shadow-sm"
          style={{
            maxWidth: cardMaxWidth,
            width: "100%",
            margin: "0 auto",
            borderRadius: "16px",
            padding: isMobile ? "1rem" : "2rem",
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
            backgroundColor: "#fff",
          }}
        >
          <div className="mb-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              aria-label="Kategori seçimi"
              style={{
                fontSize,
                padding: isMobile ? "6px" : "10px",
              }}
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
                style={{ fontSize }}
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
                style={{ fontSize }}
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
                maxWidth: "100%",
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
                  minWidth: "100%",
                  userSelect: "none",
                  fontSize,
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
