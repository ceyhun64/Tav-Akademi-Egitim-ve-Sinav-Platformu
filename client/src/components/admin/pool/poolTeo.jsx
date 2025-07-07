import React, { useEffect, useState } from "react";
import {
  getPoolTeosThunk,
  deletePoolTeoThunk,
  getPoolTeosByBookletIdThunk,
} from "../../../features/thunks/poolTeoThunk";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTeoBookletsThunk } from "../../../features/thunks/bookletThunk";
import { getDifLevelsThunk } from "../../../features/thunks/queDifThunk";
import "bootstrap/dist/css/bootstrap.min.css";
import BulkPoolTeo from "./bulkPoolTeo";
import Sidebar from "../adminPanel/sidebar";

export default function PoolTeo() {
  const dispatch = useDispatch();

  const { poolTeos = [] } = useSelector((state) => state.poolTeo);
  const { teoBooklets = [] } = useSelector((state) => state.booklet);
  const { difLevels = [] } = useSelector((state) => state.queDif);

  const [selectedBooklet, setSelectedBooklet] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    dispatch(getTeoBookletsThunk());
    dispatch(getPoolTeosThunk());
    dispatch(getDifLevelsThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    await dispatch(deletePoolTeoThunk(id));
    selectedBooklet
      ? dispatch(getPoolTeosByBookletIdThunk(selectedBooklet))
      : dispatch(getPoolTeosThunk());
  };

  const handleBookletChange = (e) => {
    const bookletId = e.target.value;
    setSelectedBooklet(bookletId);

    bookletId
      ? dispatch(getPoolTeosByBookletIdThunk(bookletId))
      : dispatch(getPoolTeosThunk());

    setExpandedRow(null);
  };

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const getDifLevelName = (id) => {
    const level = difLevels.find((level) => level.id === id);
    return level?.name || "-";
  };

  const getBookletName = (id) => {
    const booklet = teoBooklets.find((b) => b.id === id);
    return booklet?.name || "-";
  };

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
            <i className="bi bi-book-half" style={{ fontSize: "1.6rem" }}></i>{" "}
            Teorik Soru Kitapçıkları
          </h1>
        </div>

        <div
          className="filters"
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "2rem",
            overflowX: "auto", // Ekrana sığmazsa taşmasın diye
            paddingBottom: "0.5rem",
          }}
        >
          {/* Kitapçık Seçme Alanı */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            <select
              id="bookletSelect"
              value={selectedBooklet}
              onChange={handleBookletChange}
              className="form-select"
              style={{
                maxWidth: 280,
                minWidth: 200,
                borderRadius: 8,
                border: "2px solid #001b66",
                padding: "10px 14px",
                fontSize: "1.05rem",
                fontWeight: 500,
                color: "#001b66",
                backgroundColor: "#fff",
                boxShadow: "inset 0 2px 6px rgba(0, 27, 102, 0.1)",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#556cd6";
                e.target.style.boxShadow = "0 0 8px #556cd6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#001b66";
                e.target.style.boxShadow =
                  "inset 0 2px 6px rgba(0, 27, 102, 0.1)";
              }}
            >
              <option value="" style={{ color: "#001b66" }}>
                Bir kitapçık seçiniz
              </option>

              {teoBooklets.map((booklet) => (
                <option key={booklet.id} value={booklet.id}>
                  {booklet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Kitapçıkları Düzenle Butonu */}
          <div style={{ flexShrink: 0 }}>
            <Link
              to="/admin/teo-booklets"
              className="btn btn-success d-flex align-items-center gap-2"
              style={{
                height: "48px",
                fontWeight: 600,
                borderRadius: 10,
                backgroundColor: "#004aad",
                color: "#fff",
                boxShadow: "0 3px 8px rgba(0, 74, 173, 0.4)",
                transition:
                  "background-color 0.25s ease, box-shadow 0.25s ease",
                whiteSpace: "nowrap",
                padding: "0 16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0, 27, 102, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#004aad";
                e.currentTarget.style.boxShadow =
                  "0 3px 8px rgba(0, 74, 173, 0.4)";
              }}
            >
              <i className="bi bi-pencil-square" style={{ color: "#fff" }}></i>
              Kitapçıkları Düzenle
            </Link>
          </div>

          {/* Kitapçığa Soru Ekle Butonu */}
          <div style={{ flexShrink: 0 }}>
            <Link
              to="/admin/create-pool-teo"
              className="btn btn-primary d-flex align-items-center gap-2"
              style={{
                height: "48px",
                fontWeight: 600,
                padding: "0 18px",
                borderRadius: 10,
                backgroundColor: "#001b66",
                color: "#fff",
                boxShadow: "0 3px 10px rgba(0, 27, 102, 0.6)",
                transition:
                  "background-color 0.25s ease, box-shadow 0.25s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#003366";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0, 27, 102, 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.boxShadow =
                  "0 3px 10px rgba(0, 27, 102, 0.6)";
              }}
            >
              <i className="bi bi-plus-circle" style={{ color: "#fff" }}></i>
              Kitapçığa Soru Ekle
            </Link>
          </div>

          {/* Toplu Ekleme Bileşeni */}
          <div style={{ flexShrink: 0 }}>
            <BulkPoolTeo selectedBookletId={selectedBooklet} />
          </div>
        </div>

        {poolTeos.length === 0 ? (
          <p
            className="text-muted"
            style={{ fontSize: "1.1rem", color: "#666", fontStyle: "italic" }}
          >
            Henüz soru eklenmemiş.
          </p>
        ) : (
          <div
            className="table-responsive"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 4px 20px rgba(0, 27, 102, 0.15)",
            }}
          >
            <table
              className="table align-middle table-hover"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0 8px",
                fontSize: "1rem",
                color: "#001b66",
                width: "100%",
              }}
            >
              <thead style={{ backgroundColor: "#f5f7fa" }}>
                <tr style={{ userSelect: "none" }}>
                  <th
                    style={{ width: 50, textAlign: "center", padding: "12px" }}
                  ></th>
                  <th style={{ width: 70, padding: "12px" }}>ID</th>
                  <th style={{ width: 130, padding: "12px" }}>Görüntü</th>
                  <th style={{ padding: "12px" }}>Soru</th>
                  <th
                    style={{
                      width: 180,
                      minWidth: 180,
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {poolTeos.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      style={{
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                        borderRadius: "8px",
                        transition: "background-color 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f1f4ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ffffff")
                      }
                    >
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn-toggle"
                          onClick={() => toggleRow(item.id)}
                          aria-expanded={expandedRow === item.id}
                          title={
                            expandedRow === item.id
                              ? "Satırı kapat"
                              : "Satırı aç"
                          }
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "1.3rem",
                            cursor: "pointer",
                            padding: 6,
                            color: "#001b66",
                            borderRadius: 6,
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(0, 27, 102, 0.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          {expandedRow === item.id ? (
                            <i className="bi bi-dash-lg"></i>
                          ) : (
                            <i className="bi bi-plus-lg"></i>
                          )}
                        </button>
                      </td>
                      <td>{item.id}</td>
                      <td>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="Soru resmi"
                            style={{
                              maxWidth: 100,
                              maxHeight: 60,
                              borderRadius: 6,
                              objectFit: "cover",
                              boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : (
                          <span style={{ color: "#999" }}>-</span>
                        )}
                      </td>
                      <td
                        style={{
                          fontSize: "0.95rem",
                          verticalAlign: "middle",
                          color: "#001b66",
                        }}
                      >
                        <div
                          className="p-2 rounded bg-white"
                          dangerouslySetInnerHTML={{ __html: item?.question }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <button
                            className="btn-icon"
                            onClick={() => handleDelete(item.id)}
                            title="Sil"
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: "#d32f2f",
                              fontSize: "1.4rem",
                              padding: 6,
                              borderRadius: 6,
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(211, 47, 47, 0.1)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <Link
                            to={`/admin/update-pool-teo/${item.id}`}
                            className="btn-icon"
                            title="Düzenle"
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: "#001b66",
                              fontSize: "1.4rem",
                              padding: 6,
                              borderRadius: 6,
                              transition: "background-color 0.3s ease",
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(0, 27, 102, 0.1)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>

                    {expandedRow === item.id && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            backgroundColor: "#f7faff",
                            fontSize: "0.95rem",
                            color: "#003366",
                            borderRadius: "12px",
                            padding: "16px 20px",
                          }}
                        >
                          <div>
                            <strong>Şıklar:</strong>
                            <ul
                              style={{
                                paddingLeft: "1.5rem",
                                margin: "0.3rem 0 0.7rem",
                                listStyleType: "disc",
                              }}
                            >
                              <li>A: {item.a}</li>
                              <li>B: {item.b}</li>
                              <li>C: {item.c}</li>
                              <li>D: {item.d}</li>
                              <li>E: {item.e}</li>
                            </ul>
                            <p>
                              <strong>Doğru Cevap:</strong>{" "}
                              <span style={{ fontWeight: "700" }}>
                                {item.answer?.toUpperCase() || "-"}
                              </span>
                            </p>
                            <p>
                              <strong>Zorluk Seviyesi:</strong>{" "}
                              {getDifLevelName(item.difLevelId)}
                            </p>
                            <p>
                              <strong>Kitapçık:</strong>{" "}
                              {getBookletName(item.bookletId)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
