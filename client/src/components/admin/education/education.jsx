import React, { useEffect, useState } from "react";
import {
  getAllEducationsThunk,
  deleteEducationThunk,
} from "../../../features/thunks/educationThunk";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../adminPanel/sidebar";

export default function Education() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { educations } = useSelector((state) => state.education);

  const [typeFilter, setTypeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    dispatch(getAllEducationsThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteEducationThunk(id));
    dispatch(getAllEducationsThunk());
  };

  const filteredEducations = educations?.filter((item) => {
    const matchesType =
      typeFilter === "" ||
      item.type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesName = item.name
      ?.toLowerCase()
      .includes(nameFilter.toLowerCase());
    return matchesType && matchesName;
  });
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
            Eğitimler
          </h1>
        </div>

        {/* Filtre Alanı */}
        <div
          className="filters"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "2rem",
            paddingBottom: "0.5rem",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              width: "100%",
              gap: "1rem",
            }}
          >
            {/* Eğitim Ekle Butonu */}
            <div
              style={{
                className: "ms-2 me-2",
                flex: "1 1 100%",
                maxWidth: isMobile ? "100%" : "30%",
              }}
            >
              <button
                onClick={() => navigate("/admin/create-education")}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  backgroundColor: "#001b66",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                  transition: "background-color 0.3s ease, transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#003399")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#001b66")
                }
              >
                + Eğitim Ekle
              </button>
            </div>

            {/* İsim Filtreleme */}
            <div
              style={{
                className: "ms-2 me-2",

                flex: "1 1 100%",
                maxWidth: isMobile ? "100%" : "30%",
              }}
            >
              <input
                type="text"
                placeholder="İsme göre filtrele"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#001b66",
                  fontSize: "1rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            {/* Tür Filtreleme */}
            <div
              style={{
                flex: "1 1 100%",
                maxWidth: isMobile ? "100%" : "30%",
                className: "ms-2 me-2",
              }}
            >
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#001b66",
                  fontSize: "1rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <option value="">Tüm Türler</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="sunum">Sunum</option>
              </select>
            </div>
          </div>
        </div>

        {filteredEducations?.length === 0 && (
          <p style={{ textAlign: "center" }}>Eşleşen eğitim bulunamadı.</p>
        )}

        <ul
          style={{
            display: isMobile ? "flex" : "grid",
            flexDirection: isMobile ? "column" : undefined,
            gap: "1.5rem",
            padding: 0,
            margin: 0,
            listStyleType: "none", // 👈 Noktayı kaldırır

            gridTemplateColumns: isMobile
              ? undefined
              : "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {filteredEducations?.map((item) => {
            const fileType = item.file_url?.split(".").pop()?.toLowerCase();
            const fileUrl = item.file_url;

            return (
              <li
                key={item.id}
                style={{
                  width: isMobile ? "100%" : "100%",
                  maxWidth: isMobile ? "100%" : "390px",
                  backgroundColor: "#fff",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  margin: isMobile ? "0 auto" : undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ color: "#001b66", marginBottom: "0.5rem" }}>
                  {item.name}
                </h3>
                <p>
                  <strong>Açıklama:</strong> {item.description}
                </p>
                <p>
                  <strong>Süre:</strong> {item.duration} saniye
                </p>
                <p>
                  <strong>Tür:</strong> {item.type}
                </p>

                {fileType === "mp4" ? (
                  <video
                    src={fileUrl}
                    controls
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  />
                ) : fileType === "pdf" ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "160px",
                      border: "2px solid #e74c3c",
                      color: "#e74c3c",
                      backgroundColor: "#fff5f5",
                      textAlign: "center",
                      paddingTop: "55px",
                      boxSizing: "border-box",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    📄 PDF Dosyası
                  </a>
                ) : fileType === "ppt" || fileType === "pptx" ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "160px",
                      border: "2px solid #d24726",
                      backgroundColor: "#ffe6e1",
                      color: "#d24726",
                      textAlign: "center",
                      paddingTop: "55px",
                      boxSizing: "border-box",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    📊 PowerPoint Dosyası
                  </a>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      border: "1px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      color: "#999",
                      fontStyle: "italic",
                      marginBottom: "10px",
                    }}
                  >
                    Desteklenmeyen dosya türü
                  </div>
                )}

                <p
                  style={{
                    color: "#555",
                    fontSize: "14px",
                    marginTop: "1rem",
                  }}
                >
                  Oluşturulma tarihi:{" "}
                  {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      width: isMobile ? "100%" : "auto",
                      flex: 1,
                      padding: "0.5rem",
                      backgroundColor: "#e74c3c",
                      border: "none",
                      color: "#fff",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c0392b")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e74c3c")
                    }
                  >
                    Sil
                  </button>
                  <Link
                    to={`/admin/education-detail/${item.id}`}
                    style={{
                      width: isMobile ? "100%" : "auto",
                      flex: 1,
                      padding: "0.5rem",
                      backgroundColor: "#001b66",
                      color: "#fff",
                      borderRadius: "4px",
                      textAlign: "center",
                      textDecoration: "none",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#003399")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#001b66")
                    }
                  >
                    Detay
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
