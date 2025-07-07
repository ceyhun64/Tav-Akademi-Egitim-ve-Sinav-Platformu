import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadedUserThunk } from "../../../features/thunks/uploadFileThunk";
import Sidebar from "../adminPanel/sidebar";

export default function Downloaded() {
  const dispatch = useDispatch();
  const { downloadUser } = useSelector((state) => state.uploadFile);

  useEffect(() => {
    dispatch(getDownloadedUserThunk());
  }, [dispatch]);

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
              className="bi bi-clock-history "
              style={{ fontSize: "1.6rem" }}
            ></i>
            Tebliğ Takip
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
                  <th>Kullanıcı Adı</th>
                  <th>Kullanıcı Soyadı</th>
                  <th>Dosya İsmi</th>
                  <th>İndirme Tarihi</th>
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
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {new Date(item.updatedAt).toLocaleString("tr-TR")}
                    </td>
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
