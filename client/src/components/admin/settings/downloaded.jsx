import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadedUserThunk } from "../../../features/thunks/uploadFileThunk";
import Sidebar from "../adminPanel/sidebar";

export default function Downloaded() {
  const dispatch = useDispatch();
  const { downloadUser } = useSelector((state) => state.uploadFile);

  useEffect(() => {
    dispatch(getDownloadedUserThunk());
  }, [dispatch]);

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
  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik

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
            Tebliğ Takip
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

        {downloadUser && downloadUser.length > 0 ? (
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
                minWidth: isMobile ? "100%" : "1100px",
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
                  {!isMobile && <th style={{ width: "40px" }}>#</th>}
                  <th>Kullanıcı Adı</th>
                  <th>Kullanıcı Soyadı</th>
                  <th>Dosya İsmi</th>
                  {!isMobile && <th>İndirme Tarihi</th>}
                </tr>
              </thead>
              <tbody>
                {downloadUser.map((item, index) => (
                  <tr
                    key={item.file_id}
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
                    {!isMobile && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {index + 1}
                      </td>
                    )}
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.user?.ad || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.user?.soyad || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {item.file?.name || "-"}
                    </td>
                    {!isMobile && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {new Date(item.updatedAt).toLocaleString("tr-TR")}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info text-center fs-5">
            Henüz indirilen dosya bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
}
