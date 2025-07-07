import React, { useEffect, useState } from "react";
import {
  getPoolImgThunk,
  deletePoolImgThunk,
  getPoolImgsByBookletIdThunk,
} from "../../../features/thunks/poolImgThunk";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgBookletsThunk } from "../../../features/thunks/bookletThunk";
import {
  getDifLevelsThunk,
  getQuestionCatThunk,
} from "../../../features/thunks/queDifThunk";
import Sidebar from "../adminPanel/sidebar";

export default function PoolImg() {
  const dispatch = useDispatch();
  const { poolImgs } = useSelector((state) => state.poolImg);
  const { imgBooklets } = useSelector((state) => state.booklet);
  const { difLevels, questionCats } = useSelector((state) => state.queDif);
  useEffect(() => {
    dispatch(getDifLevelsThunk());
    dispatch(getQuestionCatThunk());
  }, [dispatch]);

  const [selectedBooklet, setSelectedBooklet] = useState("");
  const [expandedRow, setExpandedRow] = useState(null); // detay için

  useEffect(() => {
    dispatch(getImgBookletsThunk());
    dispatch(getPoolImgThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deletePoolImgThunk(id));
    if (selectedBooklet) {
      dispatch(getPoolImgsByBookletIdThunk(selectedBooklet));
    } else {
      dispatch(getPoolImgThunk());
    }
  };

  const handleBookletChange = (e) => {
    const bookletId = e.target.value;
    setSelectedBooklet(bookletId);

    if (bookletId) {
      dispatch(getPoolImgsByBookletIdThunk(bookletId));
    } else {
      dispatch(getPoolImgThunk());
    }
    setExpandedRow(null); // filtre değişince detay kapat
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const getDifLevelName = (id) => {
    const level = difLevels.find((level) => level.id === id);
    return level ? level.name : "-";
  };
  const getBookletName = (id) => {
    const booklet = imgBooklets.find((b) => b.id === id);
    return booklet ? booklet.name : "-";
  };
  const getQuestionCatName = (id) => {
    const cat = questionCats.find((cat) => cat.id === id);
    return cat ? cat.name : "-";
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
            <i
              className="bi bi-journal-bookmark-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>{" "}
            Uygulamalı Soru Kitapçıkları
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
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              flex: 1,
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
              style={{
                width: "100%",
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
                cursor: "pointer",
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
                Bir Kitapçık Seçiniz
              </option>
              {imgBooklets.map((booklet) => (
                <option key={booklet.id} value={booklet.id}>
                  {booklet.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, flexShrink: 0 }}>
            <Link
              to="/admin/img-booklets"
              className="btn btn-success d-flex align-items-center gap-2 justify-content-center"
              style={{
                width: "100%",
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
                textAlign: "center",
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

          <div style={{ flex: 1, flexShrink: 0 }}>
            <Link
              to="/admin/create-pool-img"
              className="btn btn-primary d-flex align-items-center gap-2 justify-content-center"
              style={{
                width: "100%",
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
                textAlign: "center",
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
        </div>

        {poolImgs?.length === 0 ? (
          <p style={{ color: "#5a6380", fontSize: "1.1rem" }}>
            Henüz soru eklenmemiş.
          </p>
        ) : (
          <div
            className="table-responsive"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <table
              className="table align-middle table-hover"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0 6px",
                width: "100%",
                color: "#001b66",
                fontSize: "1rem",
              }}
            >
              <thead style={{ backgroundColor: "#f5f7fa" }}>
                <tr>
                  <th style={{ width: 50 }}></th>
                  <th style={{ width: 70 }}>ID</th>
                  <th style={{ width: 130 }}>Görüntü</th>
                  <th>Soru</th>
                  <th style={{ width: 180, minWidth: 180 }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {poolImgs?.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      style={{
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        borderRadius: "8px",
                        transition: "background-color 0.3s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f5ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ffffff")
                      }
                    >
                      <td>
                        <button
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
                            padding: 8,
                            color: "#001b66",
                            borderRadius: 8,
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c6d0ff")
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
                              maxWidth: 110,
                              maxHeight: 70,
                              borderRadius: 6,
                              objectFit: "cover",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : (
                          <span style={{ color: "#718096" }}>-</span>
                        )}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          color: "#001b66",
                          padding: "8px 12px",
                        }}
                        className="mb-4 p-3 border rounded bg-white"
                        dangerouslySetInnerHTML={{ __html: item?.question }}
                      />
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Sil"
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: "#001b66",
                              fontSize: "1.35rem",
                              padding: 8,
                              borderRadius: 8,
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#c6d0ff")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <Link
                            to={`/admin/update-pool-img/${item.id}`}
                            title="Düzenle"
                            style={{
                              color: "#001b66",
                              fontSize: "1.35rem",
                              padding: 8,
                              borderRadius: 8,
                              transition: "background-color 0.3s ease",
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#c6d0ff")
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
                            backgroundColor: "#e6efff",
                            fontSize: "0.95rem",
                            color: "#003080",
                            padding: "12px 24px",
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                            userSelect: "text",
                          }}
                        >
                          <div>
                            <strong>Şıklar:</strong>
                            <ul
                              style={{
                                paddingLeft: "1.5rem",
                                margin: "0.5rem 0 1rem",
                                color: "#001b66",
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                              }}
                            >
                              <li>A: {item.a}</li>
                              <li>B: {item.b}</li>
                              <li>C: {item.c}</li>
                              <li>D: {item.d}</li>
                              <li>E: {item.e}</li>
                              <li>F: {item.f}</li>
                            </ul>

                            <p>
                              <strong>Doğru Cevap:</strong>{" "}
                              <span
                                style={{ color: "#001b66", fontWeight: "700" }}
                              >
                                {item.answer.toUpperCase()}
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
                            <p>
                              <strong>Kategorisi:</strong>{" "}
                              {getQuestionCatName(item.questionCategoryId)}
                            </p>
                            <p>
                              <strong>Koordinat:</strong>{" "}
                              {item.coordinate
                                ? JSON.stringify(item.coordinate)
                                : "-"}
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
