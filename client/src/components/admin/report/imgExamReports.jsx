import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserImgResultsThunk,
  deleteUserExamResultThunk,
} from "../../../features/thunks/reportThunk";
import { useNavigate } from "react-router-dom";
import Sidebar from "../adminPanel/sidebar";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";

// Geçen süreyi hesaplayan fonksiyon
function calculateDuration(entryDate, entryTime, exitDate, exitTime) {
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute = 0, second = 0] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const entry = parseDateTime(entryDate, entryTime);
  const exit = parseDateTime(exitDate, exitTime);

  if (!entry || !exit || isNaN(entry) || isNaN(exit) || exit < entry)
    return "-";

  const diffMs = exit - entry;
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = [];
  if (hours > 0) result.push(`${hours} saat`);
  if (minutes > 0 || hours > 0) result.push(`${minutes} dk`);
  result.push(`${seconds} sn`);

  return result.join(" ");
}

export default function ImgExamReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userImgResults } = useSelector((state) => state.report);
  const { groups, institutions } = useSelector((state) => state.grpInst);
  // Filtre state'leri
  const [filterLokasyon, setFilterLokasyon] = useState("");
  const [filterGrup, setFilterGrup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterKisi, setFilterKisi] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
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
    dispatch(getUserImgResultsThunk());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  useEffect(() => {
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const selectWidth = 300;
  const results = userImgResults?.data || [];
  console.log("results:", results);
  // Lokasyon ve grup uniq listeleri

  // Filtrelenmiş sonuçlar
  const filteredResults = results.filter((r) => {
    const user = r.user || {};
    const exam = r.exam || {};

    if (filterLokasyon && String(user.lokasyonId) !== filterLokasyon)
      return false;
    if (filterGrup && String(user.grupId) !== filterGrup) return false;
    if (startDate && exam.start_date < startDate) return false;
    if (endDate && exam.start_date > endDate) return false;

    if (filterKisi) {
      const searchTerm = filterKisi.toLowerCase();
      const ad = (user.ad || user.kullanici_adi || "").toLowerCase();
      const soyad = (user.soyad || "").toLowerCase();
      const sicil = (user.sicil || "").toString().toLowerCase();

      if (
        !ad.includes(searchTerm) &&
        !soyad.includes(searchTerm) &&
        !sicil.includes(searchTerm)
      ) {
        return false;
      }
    }

    return true;
  });

  const handleCheckboxChange = (uniqueId) => {
    setSelectedIds((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((x) => x !== uniqueId)
        : [...prev, uniqueId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredResults.length) {
      setSelectedIds([]);
    } else {
      const allIds = filteredResults.map((r) => `${r.userId}-${r.examId}`);
      setSelectedIds(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (
      selectedIds.length > 0 &&
      window.confirm(
        `${selectedIds.length} sonucu silmek istediğinize emin misiniz?`
      )
    ) {
      const formattedIds = selectedIds.map((id) => {
        const [userId, examId] = id.split("-");
        return { userId: Number(userId), examId: Number(examId) };
      });

      await dispatch(
        deleteUserExamResultThunk({ userExamIds: formattedIds })
      ).unwrap();
      dispatch(getUserImgResultsThunk());
      setSelectedIds([]);
    }
  };

  if (results.length === 0) {
    return <p>Yükleniyor veya veri yok...</p>;
  }
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
            Uygulamalı Sınav Sonuçları
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

        {/* Filtreleme inputları */}
        <div className="row mb-5 gx-3 gy-3">
          {[
            {
              type: "text",
              placeholder: "Kişi Ara (Ad / Soyad / Sicil)",
              value: filterKisi,
              onChange: (e) => setFilterKisi(e.target.value),
              colClass: "col-12 col-md-3",
            },
            {
              type: "select",
              options: [{ id: "", name: "Tüm Lokasyonlar" }, ...institutions],
              value: filterLokasyon,
              onChange: (e) => setFilterLokasyon(e.target.value),
              colClass: "col-12 col-md-3",
              keyField: "id",
              labelField: "name",
            },
            {
              type: "select",
              options: [{ id: "", name: "Tüm Gruplar" }, ...groups],
              value: filterGrup,
              onChange: (e) => setFilterGrup(e.target.value),
              colClass: "col-12 col-md-2",
              keyField: "id",
              labelField: "name",
            },
            {
              type: "date",
              placeholder: "Başlangıç Tarihi",
              value: startDate,
              onChange: (e) => setStartDate(e.target.value),
              colClass: "col-12 col-md-2",
            },
            {
              type: "date",
              placeholder: "Bitiş Tarihi",
              value: endDate,
              onChange: (e) => setEndDate(e.target.value),
              colClass: "col-12 col-md-2",
            },
          ].map((input, idx) => (
            <div key={idx} className={input.colClass}>
              {input.type === "select" ? (
                <select
                  className="form-select"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: "0 2px 8px rgb(0 51 153 / 0.15)",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e0",
                    transition: "border-color 0.25s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#003399")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
                >
                  {input.options.map((opt) => (
                    <option
                      key={opt[input.keyField]}
                      value={opt[input.keyField]}
                    >
                      {opt[input.labelField]}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={input.type}
                  className="form-control"
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: "0 2px 8px rgb(0 51 153 / 0.15)",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e0",
                    transition: "border-color 0.25s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#003399")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
                />
              )}
            </div>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-4 text-end">
            <button
              className="btn"
              onClick={handleDeleteSelected}
              style={{
                backgroundColor: "#e03131",
                color: "#fff",
                fontWeight: "600",
                padding: "0.6rem 1.4rem",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgb(224 49 49 / 0.5)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#b22222")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#e03131")
              }
            >
              Seçilenleri Sil ({selectedIds.length})
            </button>
          </div>
        )}

        {filteredResults.length === 0 ? (
          <p
            className="text-center text-muted"
            style={{ fontSize: "1.1rem", marginTop: "4rem" }}
          >
            Veri bulunamadı...
          </p>
        ) : (
          <div
            className="table-responsive"
            style={{
              borderRadius: "16px",
              overflowX: "hidden", // sağa kaydırmayı engelle
              maxWidth: "100%", // tam ekran genişliği al
              maxHeight: "800px",
              boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              padding: "8px",
            }}
          >
            <table
              className="table align-middle table-hover"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0 6px",
                width: "100%", // minWidth kaldırıldı, genişlik tam ekran
                fontSize: "12px", // font küçüldü
                userSelect: "none",
                tableLayout: "fixed", // sütunlar eşit dağılsın
              }}
            >
              <thead
                style={{ backgroundColor: "#e9f1ff", borderRadius: "12px" }}
              >
                <tr
                  className="text-center align-middle"
                  style={{ fontWeight: "600", color: "#334155" }}
                >
                  {!isMobile && (
                    <th style={{ width: "30px", padding: "6px 4px" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredResults.length}
                        onChange={handleSelectAll}
                        style={{ cursor: "pointer", transform: "scale(0.8)" }}
                      />
                    </th>
                  )}

                  {isMobile ? (
                    <>
                      <th style={{ padding: "6px 8px" }}>Ad</th>
                      <th style={{ padding: "6px 8px" }}>Soyad</th>
                      <th style={{ padding: "6px 8px" }}>Puan</th>
                    </>
                  ) : (
                    [
                      "Lokasyon",
                      "Grup",
                      "Sicil",
                      "Ad",
                      "Soyad",
                      "Sınav Tarihi",
                      "Başlangıç",
                      "Bitiş",
                      "Katılım Tarihi",
                      "Giriş",
                      "Çıkış",
                      "Geçen Süre",
                      "Sınav Adı",
                      "Kitapçık",
                      "Soru Sayısı",
                      "Doğru",
                      "Yanlış",
                      "Puan",
                      "Geçme Notu",
                      "Sonuç",
                      "Tamamlandı mı?",
                    ].map((header, i) => (
                      <th
                        key={i}
                        className={
                          [
                            "Soru Sayısı",
                            "Doğru",
                            "Yanlış",
                            "Puan",
                            "Geçme Notu",
                          ].includes(header)
                            ? "text-end"
                            : "text-center"
                        }
                        style={{
                          whiteSpace: "nowrap",
                          padding: "6px 8px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={header}
                      >
                        {header}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result, index) => {
                  const user = result.user || {};
                  const exam = result.exam || {};

                  return (
                    <tr
                      key={`${result.userId}-${result.examId}-${index}`}
                      onClick={() =>
                        navigate(
                          `/admin/img-report-detail/${result.userId}/${result.examId}`
                        )
                      }
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        fontSize: "12px",
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
                          onClick={(e) => e.stopPropagation()}
                          style={{ textAlign: "center", padding: "6px 4px" }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(
                              `${result.userId}-${result.examId}`
                            )}
                            onChange={() =>
                              handleCheckboxChange(
                                `${result.userId}-${result.examId}`
                              )
                            }
                            style={{
                              cursor: "pointer",
                              transform: "scale(0.8)",
                            }}
                          />
                        </td>
                      )}

                      {isMobile ? (
                        <>
                          <td style={{ textAlign: "center" }}>
                            {user.ad || user.kullanici_adi || "-"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {user.soyad || "-"}
                          </td>
                          <td
                            style={{ textAlign: "center", paddingRight: "8px" }}
                          >
                            {result.score ?? "-"}
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Mevcut tüm hücreler burada: */}
                          <td>
                            {institutions.find((i) => i.id === user.lokasyonId)
                              ?.name || "-"}
                          </td>
                          <td>
                            {groups.find((g) => g.id === user.grupId)?.name ||
                              "-"}
                          </td>
                          <td>{user.sicil || "-"}</td>
                          <td>{user.ad || user.kullanici_adi || "-"}</td>
                          <td>{user.soyad || "-"}</td>
                          <td>{exam.start_date || "-"}</td>
                          <td>{exam.start_time || "-"}</td>
                          <td>{exam.end_time || "-"}</td>
                          <td>{result.entry_date || "-"}</td>
                          <td>{result.entry_time || "-"}</td>
                          <td>{result.exit_time || "-"}</td>
                          <td>
                            {calculateDuration(
                              result.entry_date,
                              result.entry_time,
                              result.exit_date,
                              result.exit_time
                            )}
                          </td>
                          <td>{exam.name || "-"}</td>
                          <td>{exam.booklet?.name || "-"}</td>
                          <td className="text-end">
                            {exam.question_count ?? "-"}
                          </td>
                          <td className="text-end">
                            {result.true_count ?? "-"}
                          </td>
                          <td className="text-end">
                            {result.false_count ?? "-"}
                          </td>
                          <td className="text-end">{result.score ?? "-"}</td>
                          <td className="text-end">
                            {exam.passing_score ?? "-"}
                          </td>
                          <td>
                            <span
                              className={
                                result.pass
                                  ? "text-success fw-semibold"
                                  : "text-danger fw-semibold"
                              }
                            >
                              {result.pass ? "Başarılı" : "Başarısız"}
                            </span>
                          </td>
                          <td>{result.completed ? "Evet" : "Hayır"}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
