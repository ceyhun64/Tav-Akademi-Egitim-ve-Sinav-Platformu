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

  return (
    <div className="poolteo-container" style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <Sidebar />
      </div>
      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2rem",
          backgroundColor: "#f8f9fc",
          minHeight: "100vh",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              color: "#001b66",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-collection-fill"
              style={{ marginRight: "8px" }}
            ></i>
            Eğitim Setleri
          </h2>
        </div>

        {/* Filtreler */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => navigate("/admin/create-education-set")}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: "#001b66",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
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
          <input
            type="text"
            placeholder="İsme göre filtrele"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "220px",
              backgroundColor: "#fff",
              color: "#001b66",
              fontSize: "14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          />
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
