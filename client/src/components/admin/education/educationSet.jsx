import React, { useEffect, useState } from "react";
import {
  getEducationSetsThunk,
  deleteEducationSetThunk,
} from "../../../features/thunks/educationSetThunk";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../adminPanel/sidebar";

export default function Education() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { educationSets } = useSelector((state) => state.educationSet);
  console.log("education state:", educationSets);

  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    dispatch(getEducationSetsThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteEducationSetThunk(id));
    dispatch(getEducationSetsThunk());
  };

  // Filtrelenmiş liste
  const filteredEducationSets = educationSets?.filter((item) => {
    const matchesName = item.name
      ?.toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesType =
      typeFilter === "" ||
      (item.type && item.type.toLowerCase() === typeFilter.toLowerCase());
    return matchesName && matchesType;
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
            Eğitim Setleri
          </h1>
        </div>

        {/* Filtreler */}
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
                maxWidth: isMobile ? "100%" : "25%",
              }}
            >
              <button
                onClick={() => navigate("/admin/create-education-set")}
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
                + Eğitim Seti Ekle
              </button>
            </div>
            <div
              style={{
                className: "ms-2 me-2",

                flex: "1 1 100%",
                maxWidth: isMobile ? "100%" : "25%",
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
          </div>
        </div>

        {filteredEducationSets?.length === 0 ? (
          <p>Henüz eğitim seti bulunamadı.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredEducationSets.map((item) => {
              const fileType = item.file_url?.split(".").pop();
              const fileUrl = item.file_url;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 style={{ color: "#001b66", marginBottom: "0.5rem" }}>
                    {item.name}
                  </h3>

                  <p
                    style={{
                      color: "#555",
                      fontSize: "14px",
                      marginBottom: "1rem",
                    }}
                  >
                    Oluşturulma Tarihi:{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#e74c3c",
                        border: "none",
                        color: "#fff",
                        borderRadius: "6px",
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
                      to={`/admin/education-set-detail/${item.id}`}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#001b66",
                        color: "#fff",
                        borderRadius: "6px",
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
