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

  // Sayfalama state'leri
  const [itemsPerPage, setItemsPerPage] = useState(10); // Varsayılan olarak 10 soru
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null); // Detayları göstermek için

  const [selectedBooklet, setSelectedBooklet] = useState("");

  // Filtered pool images based on selectedBooklet
  const filteredPoolImgs = selectedBooklet
    ? poolImgs.filter((item) => item.bookletId === selectedBooklet)
    : poolImgs;

  // Toplam sayfa sayısı (filteredPoolImgs üzerinden hesaplanmalı)
  const totalPages = Math.ceil(filteredPoolImgs.length / itemsPerPage);

  // Mevcut sayfada gösterilecek sorular (filteredPoolImgs üzerinden slice edilmeli)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = filteredPoolImgs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
    dispatch(getDifLevelsThunk());
    dispatch(getQuestionCatThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getImgBookletsThunk());
    dispatch(getPoolImgThunk()); // Initial fetch of all pool images
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;

    await dispatch(deletePoolImgThunk(id));
    // After deletion, re-fetch based on current filter or all
    if (selectedBooklet) {
      dispatch(getPoolImgsByBookletIdThunk(selectedBooklet));
    } else {
      dispatch(getPoolImgThunk());
    }
  };

  const handleBookletChange = (e) => {
    const bookletId = e.target.value;
    setSelectedBooklet(bookletId);
    setCurrentPage(1); // Reset to first page when booklet filter changes
    setExpandedRow(null); // Close any expanded rows

    if (bookletId) {
      dispatch(getPoolImgsByBookletIdThunk(bookletId));
    } else {
      dispatch(getPoolImgThunk()); // Fetch all if no booklet is selected
    }
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
  // const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik - Bu değişken kullanılmıyor

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
            Uygulamalı Soru Kitapçıkları
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
        <div
          className="filters"
          style={{
            display: "flex",
            flexWrap: "wrap", // burada nowrap değil wrap yapıyoruz
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
              flexWrap: "wrap", // çocukların sarılmasına izin veriyoruz
              width: "100%", // satırı kaplasın
            }}
          >
            <div
              className="ms-2 me-2"
              style={{
                flex: isMobile ? "0 0 100%" : "1 1 30%", // mobilde tam satır, masaüstünde yaklaşık 1/3
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
                  Bir Kitapçık Seçiniz
                </option>
                {imgBooklets.map((booklet) => (
                  <option key={booklet.id} value={booklet.id}>
                    {booklet.name}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="ms-2 me-2"
              style={{
                flex: isMobile ? "0 0 100%" : "1 1 30%",
                minWidth: 0,
              }}
            >
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
                <i
                  className="bi bi-pencil-square"
                  style={{ color: "#fff" }}
                ></i>
                Kitapçıkları Düzenle
              </Link>
            </div>

            <div
              className="ms-2 me-2"
              style={{
                flex: isMobile ? "0 0 100%" : "1 1 30%",
                minWidth: 0,
              }}
            >
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
                setCurrentPage(1); // Sayfa boyutu değiştiğinde ilk sayfaya dön
                setExpandedRow(null); // Detayları kapat
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

          {/* Toplam soru sayısı (filteredPoolImgs üzerinden gösterilmeli) */}
          <div style={{ whiteSpace: "nowrap" }}>
            Toplam Soru: {filteredPoolImgs.length}
          </div>
        </div>
        {filteredPoolImgs?.length === 0 ? (
          <p style={{ color: "#5a6380", fontSize: "1.1rem" }}>
            Henüz soru eklenmemiş.
          </p>
        ) : (
          <div
            className="table-responsive"
            style={{
              borderRadius: "12px",
              overflow: "auto",
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
                minWidth: isMobile ? "100%" : "600px", // mobilde yatay scroll kapatıp full width yapabilirsin
              }}
            >
              <thead style={{ backgroundColor: "#f5f7fa" }}>
                <tr>
                  <th style={{ width: 50 }}></th>

                  {!isMobile && (
                    <>
                      <th className="col-id" style={{ width: 70 }}>
                        Sıra
                      </th>
                      <th className="col-image" style={{ width: 130 }}>
                        Görüntü
                      </th>
                    </>
                  )}

                  <th>Soru</th>

                  {!isMobile && (
                    <th
                      className="col-actions"
                      style={{ width: 180, minWidth: 180 }}
                    >
                      İşlemler
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentQuestions?.map((item, index) => (
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
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>{" "}
                      {/* Corrected index for current page */}
                      {!isMobile && (
                        <td className="col-image">
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
                      )}
                      <td
                        style={{
                          verticalAlign: "middle",
                          color: "#001b66",
                          padding: "8px 12px",
                        }}
                        className="mb-4 p-3 border rounded bg-white"
                        dangerouslySetInnerHTML={{ __html: item?.question }}
                      />
                      {!isMobile && (
                        <td className="col-actions">
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
                      )}
                    </tr>
                    {expandedRow === item.id && (
                      <tr>
                        <td
                          colSpan={isMobile ? 2 : 5}
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
                                style={{
                                  color: "#001b66",
                                  fontWeight: "700",
                                }}
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
        {/* Pagination Controls */}
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
