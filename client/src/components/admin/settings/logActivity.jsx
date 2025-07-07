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

  return (
    <div
      className="poolteo-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden", // yatay kaymayı engeller
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1.5rem 1.2rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#003399", // biraz daha canlı mavi
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2.5rem 3rem",
          backgroundColor: "#f4f6fc",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          color: "#222",
        }}
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
            <i
              className="bi bi-journal-check"
              style={{ fontSize: "1.6rem" }}
            ></i>
            İşlem Kayıtları
          </h1>
        </div>{" "}
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
                  minWidth: "1100px",
                  userSelect: "none",
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
                    <th style={{ width: "40px" }}>#</th>
                    <th>Zaman</th>
                    <th>Aksiyon</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                        borderRadius: "10px",
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
                        style={{ verticalAlign: "middle" }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
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
