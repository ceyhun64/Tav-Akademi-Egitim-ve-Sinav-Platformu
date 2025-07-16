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
  // Sayfalama state'leri
  const [itemsPerPage, setItemsPerPage] = useState(10); // Varsayılan olarak 10 soru
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null); // Detayları göstermek için

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(poolTeos.length / itemsPerPage);

  // Mevcut sayfada gösterilecek sorular
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = poolTeos.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa numarası değiştirme fonksiyonu
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedRow(null); // Yeni sayfaya geçildiğinde açık olan satırları kapat
  };

  // Sayfalama düğmeleri için dinamik dizi oluşturma
  const pageNumbers = [];
  // Çok fazla sayfa varsa, sadece belirli bir aralığı göster (örn: 5 sayfa)
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  

  // Satır genişletme/daraltma

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
            Teorik Soru Kitapçıkları
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "30px",
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap",
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>

        <div
          className="filters"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "2rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "0.75rem",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {/* Kitapçık Seçme Alanı */}
            <div
              style={{
                flex: isMobile ? "0 0 100%" : "0 0 20%",
                minWidth: 0,
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
            <div
              style={{
                flex: isMobile ? "0 0 100%" : "0 0 20%",
                minWidth: 0,
              }}
            >
              <Link
                to="/admin/teo-booklets"
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
                <i
                  className="bi bi-pencil-square"
                  style={{ color: "#fff" }}
                ></i>
                Kitapçıkları Düzenle
              </Link>
            </div>

            {/* Kitapçığa Soru Ekle Butonu */}
            <div
              style={{
                flex: isMobile ? "0 0 100%" : "0 0 20%",
                minWidth: 0,
              }}
            >
              <Link
                to="/admin/create-pool-teo"
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

            {/* Toplu Ekleme Bileşeni */}
            <div
              style={{
                flex: isMobile ? "0 0 100%" : "0 0 30%",
                minWidth: 0,
              }}
            >
              <BulkPoolTeo selectedBookletId={selectedBooklet} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            backgroundColor: "#f5f7fa",
            borderBottom: "1px solid #ddd",
            color: "#001b66",
            fontWeight: 600,
            fontSize: "1rem",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {/* Sayfa başına soru seçimi */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="itemsPerPageSelect">Sayfa Başına Soru:</label>
            <select
              id="itemsPerPageSelect"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
                setExpandedRow(null);
              }}
              style={{
                padding: "5px 8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                fontSize: "0.95rem",
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          {/* Toplam soru sayısı */}
          <div style={{ whiteSpace: "nowrap" }}>
            Toplam Soru: {poolTeos.length}
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
                  <th style={{ width: 70, padding: "12px" }}>Sıra</th>
                  {/* Görüntü sütunu, sadece masaüstü */}
                  {!isMobile && (
                    <th style={{ width: 130, padding: "12px" }}>Görüntü</th>
                  )}
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
                {currentQuestions.map((item, index) => (
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
                      {/* Sıra numarası olarak index değil, sayfa ve index birleşimi kullanılıyor */}
                      <td>{indexOfFirstItem + index + 1}</td>
                      {!isMobile && (
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
                      )}
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
                          colSpan={isMobile ? 4 : 5}
                          style={{
                            backgroundColor: "#f7faff",
                            fontSize: "0.95rem",
                            color: "#003366",
                            borderRadius: "12px",
                            padding: "16px 20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
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
                              </ul>
                            </div>

                            <p>
                              <strong>Doğru Cevap:</strong>{" "}
                              <span
                                style={{ color: "#001b66", fontWeight: "700" }}
                              >
                                {item.answer?.toUpperCase()}
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

        {/* Sayfalama Kontrolleri */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline-secondary btn-sm"
              style={{
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                marginRight: "0",
              }}
            >
              Önceki
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`btn btn-sm ${
                  currentPage === number ? "btn-primary" : "btn-outline-primary"
                }`}
                style={{
                  borderRadius: "6px",
                  boxShadow:
                    currentPage === number
                      ? "0 2px 8px rgba(0,123,255,0.4)"
                      : "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "background-color 0.3s, box-shadow 0.3s",
                  margin: "0",
                  minWidth: "36px",
                  padding: "0 12px",
                  fontWeight: currentPage === number ? "600" : "400",
                }}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline-secondary btn-sm"
              style={{
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                marginLeft: "0",
              }}
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
