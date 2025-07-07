import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserTeoResultsThunk,
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

export default function TeoExamReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userTeoResults } = useSelector((state) => state.report);
  const { groups, institutions } = useSelector((state) => state.grpInst);
  // Filtre state'leri
  const [filterLokasyon, setFilterLokasyon] = useState("");
  const [filterGrup, setFilterGrup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterKisi, setFilterKisi] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(getUserTeoResultsThunk());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const results = userTeoResults?.data || [];
  console.log("results:", results);
  // Lokasyon ve grup uniq listeleri
  const lokasyonlar = Array.from(
    new Set(results.map((r) => r.user?.lokasyon).filter(Boolean))
  );
  const gruplar = Array.from(
    new Set(results.map((r) => r.user?.grup).filter(Boolean))
  );

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

  if (results.length === 0) {
    return <p>Yükleniyor veya veri yok...</p>;
  }

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
      dispatch(getUserTeoResultsThunk());
      setSelectedIds([]);
    }
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
              className="bi bi-file-earmark-text-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Teorik Sınav Sonuçları
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
                style={{ backgroundColor: "#e9f1ff", borderRadius: "12px" }}
              >
                <tr
                  className="text-center align-middle"
                  style={{ fontWeight: "600", color: "#334155" }}
                >
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredResults.length}
                      onChange={handleSelectAll}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  {[
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
                      style={{ whiteSpace: "nowrap", padding: "12px 8px" }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => {
                  const user = result.user || {};
                  const exam = result.exam || {};
                  const duration = calculateDuration(
                    result.entry_date,
                    result.entry_time,
                    result.exit_date,
                    result.exit_time
                  );

                  return (
                    <tr
                      key={`${result.userId}-${result.examId}-${index}`}
                      onClick={() =>
                        navigate(
                          `/admin/teo-report-detail/${result.userId}/${result.examId}`
                        )
                      }
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                        borderRadius: "10px",
                        cursor: "pointer",
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
                        onClick={(e) => e.stopPropagation()}
                        style={{ textAlign: "center" }}
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
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {institutions.find((i) => i.id === user.lokasyonId)
                          ?.name || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {groups.find((g) => g.id === user.grupId)?.name || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {user.sicil || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {user.ad || user.kullanici_adi || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {user.soyad || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {exam.start_date || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {exam.start_time || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {exam.end_time || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {result.entry_date || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {result.entry_time || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {result.exit_time || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>{duration}</td>
                      <td style={{ textAlign: "center" }}>
                        {exam.name || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {exam.booklet?.name || "-"}
                      </td>
                      <td className="text-end" style={{ paddingRight: "16px" }}>
                        {exam.question_count ?? "-"}
                      </td>
                      <td className="text-end" style={{ paddingRight: "16px" }}>
                        {result.true_count ?? "-"}
                      </td>
                      <td className="text-end" style={{ paddingRight: "16px" }}>
                        {result.false_count ?? "-"}
                      </td>
                      <td className="text-end" style={{ paddingRight: "16px" }}>
                        {result.score ?? "-"}
                      </td>
                      <td className="text-end" style={{ paddingRight: "16px" }}>
                        {exam.passing_score ?? "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={
                            result.pass
                              ? "text-success fw-semibold"
                              : "text-danger fw-semibold"
                          }
                          style={{ fontWeight: "600" }}
                        >
                          {result.pass ? "Başarılı" : "Başarısız"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {result.completed ? "Evet" : "Hayır"}
                      </td>
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
