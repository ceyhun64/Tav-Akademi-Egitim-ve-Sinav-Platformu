import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllUserEducationSetsResultThunk,
  deleteUserEducationResultThunk,
} from "../../../features/thunks/reportThunk";
import { useNavigate } from "react-router-dom";
import Sidebar from "../adminPanel/sidebar";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";

export default function EducationSetReports() {
  const { userEducationSetsResult } = useSelector((state) => state.report);
  const { groups, institutions } = useSelector((state) => state.grpInst);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filtreler
  const [filterLokasyon, setFilterLokasyon] = useState("");
  const [filterGrup, setFilterGrup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterKisi, setFilterKisi] = useState("");

  // Yeni: Seçilen ID'leri tutacak state
  // ID formatı: `${userId}-${educationSetId}`
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(getAllUserEducationSetsResultThunk());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const lokasyonlar = useMemo(() => {
    if (!userEducationSetsResult?.data) return [];
    return Array.from(
      new Set(
        userEducationSetsResult.data
          .map((item) => item.user?.lokasyon)
          .filter(Boolean)
      )
    );
  }, [userEducationSetsResult]);

  const gruplar = useMemo(() => {
    if (!userEducationSetsResult?.data) return [];
    return Array.from(
      new Set(
        userEducationSetsResult.data
          .map((item) => item.user?.grup)
          .filter(Boolean)
      )
    );
  }, [userEducationSetsResult]);

  const filteredData = useMemo(() => {
    if (!userEducationSetsResult?.data) return [];

    return userEducationSetsResult.data.filter((item) => {
      const user = item.user || {};

      // Burada grup ve lokasyon id'lerine göre kontrol
      if (filterLokasyon && user.lokasyonId !== Number(filterLokasyon))
        return false;
      if (filterGrup && user.grupId !== Number(filterGrup)) return false;

      if (startDate && item.start_date < startDate) return false;
      if (endDate && item.start_date > endDate) return false;

      if (filterKisi) {
        const searchTerm = filterKisi.toLowerCase();
        const ad = (user.ad || "").toLowerCase();
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
  }, [
    userEducationSetsResult,
    filterLokasyon,
    filterGrup,
    startDate,
    endDate,
    filterKisi,
  ]);

  const handleRowClick = (userId, educationSetId) => {
    navigate(`/admin/education-report/${userId}/${educationSetId}`);
  };

  // --- Silme fonksiyonları ---

  const handleCheckboxChange = (uniqueId) => {
    setSelectedIds((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((x) => x !== uniqueId)
        : [...prev, uniqueId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      const allIds = filteredData.map(
        (item) => `${item.userId}-${item.educationSetId}`
      );
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
        const [userId, educationSetId] = id.split("-");
        return {
          userId: Number(userId),
          educationSetId: Number(educationSetId),
        };
      });

      try {
        await dispatch(
          deleteUserEducationResultThunk({ userEducationIds: formattedIds })
        ).unwrap();
        dispatch(getAllUserEducationSetsResultThunk());
        setSelectedIds([]);
      } catch (error) {
        alert("Silme işlemi sırasında hata oluştu.");
      }
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
              className="bi bi-clipboard-check-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Eğitim Seti Sonuçları
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

        {/* Seçilenler varsa silme butonu */}
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
        {filteredData.length === 0 ? (
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
                textAlign: "center",
              }}
            >
              <thead
                style={{ backgroundColor: "#e9f1ff", borderRadius: "12px" }}
              >
                <tr
                  style={{ fontWeight: "600", color: "#334155" }}
                  className="text-center align-middle"
                >
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredData.length &&
                        filteredData.length > 0
                      }
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
                    "Eğitim Seti Adı",
                    "Başlangıç Tarihi",
                    "Bitiş Tarihi",
                    "Başlangıç Saati",
                    "Bitiş Saati",
                    "Tamamlandı mı?",
                    "Teorik Sınav Puanı",
                    "Görüntü Sınav Puanı",
                  ].map((header, i) => (
                    <th
                      key={i}
                      style={{ whiteSpace: "nowrap", padding: "12px 8px" }}
                      className="text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const uniqueId = `${item.userId}-${item.educationSetId}`;
                    const isSelected = selectedIds.includes(uniqueId);

                    return (
                      <tr
                        key={index}
                        className={
                          isSelected
                            ? "table-warning cursor-pointer"
                            : "cursor-pointer"
                        }
                        onClick={() =>
                          handleRowClick(item.userId, item.educationSetId)
                        }
                        style={{
                          userSelect: "none",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                          borderRadius: "10px",
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
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange(uniqueId);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {institutions.find(
                            (inst) => inst.id === item.user?.lokasyonId
                          )?.name || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {groups.find((grp) => grp.id === item.user?.grupId)
                            ?.name || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.user?.sicil || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.user?.ad || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.user?.soyad || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.educationSet?.name || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.start_date || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.finish_date || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.start_time || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.finish_time || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.finished ? "Evet" : "Hayır"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.exam_theoretical_score || "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.exam_video_score || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="14" style={{ textAlign: "center" }}>
                      Veri bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
