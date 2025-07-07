import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCompletedEducationSetsThunk,
  createCertificateThunk,
} from "../../../features/thunks/certificateThunk";
import { getEducationSetsThunk } from "../../../features/thunks/educationSetThunk";
import Sidebar from "../adminPanel/sidebar";
import { useNavigate } from "react-router-dom";

export default function Certificate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { completedEducationSets, loading, error } = useSelector(
    (state) => state.certificate
  );
  const { educationSets, loading: educationLoading } = useSelector(
    (state) => state.educationSet
  );
  const [educationSetId, setEducationSetId] = useState("");
  const [selectedCertificates, setSelectedCertificates] = useState({});

  useEffect(() => {
    dispatch(getEducationSetsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (educationSetId) {
      dispatch(getCompletedEducationSetsThunk(educationSetId));
      setSelectedCertificates({});
    }
  }, [educationSetId, dispatch]);

  const handleChange = (e) => {
    setEducationSetId(e.target.value);
  };

  const users = completedEducationSets?.completeUsers || [];
  const requester = completedEducationSets?.requester || {};

  const formatDateTime = (date, time) => {
    return date && time ? `${date} ${time}` : "-";
  };

  const toggleSelect = (userId) => {
    setSelectedCertificates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };
  const onToggleAll = (checked) => {
    if (checked) {
      // Tüm kullanıcıların ID'lerini seçili yap
      const allSelected = {};
      users.forEach((item) => {
        const id = item.user?.id;
        if (id) allSelected[id] = true;
      });
      setSelectedCertificates(allSelected);
    } else {
      // Hiçbiri seçili olmasın
      setSelectedCertificates({});
    }
  };

  const handleCreateCertificates = () => {
    const certificates = users
      .filter((item) => selectedCertificates[item.user.id])
      .map((item) => {
        const user = item.user || {};
        return {
          tc: user.tcno,
          name: user.ad,
          surname: user.soyad,
          educationSet_name: item.EducationSet?.name || "",
          education_name: item.EducationSet?.educations?.[0]?.name || "",
          requester: `${requester.ad || ""} ${requester.soyad || ""}`.trim(),
          education_date: item.entry_date,
          educatorName: item.educator || "",
          comment: "Başarılı",
          certificate_number: `TAV/FRONTEND/${user.id
            .toString()
            .padStart(6, "0")}`,
          exam_date: item.exam_date || "",
          institution: "Tav Güvenlik",
          educationSet_end_date: item.end_date || "",
        };
      });

    if (certificates.length === 0) {
      alert("Lütfen en az bir sertifika seçiniz.");
      return;
    }

    dispatch(createCertificateThunk({ certificates }));
  };

  return (
    <div className="poolteo-container">
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
          <h1
            style={{
              color: "#001b66",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-file-earmark-text-fill"
              style={{ marginRight: "8px" }}
            ></i>
            Sertifika Oluştur
          </h1>
        </div>

        {educationLoading && (
          <div className="alert alert-info" role="alert">
            Yükleniyor...
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3 d-flex align-items-center">
          <label
            htmlFor="educationSetSelect"
            className="form-label me-3 mb-0"
            style={{ whiteSpace: "nowrap" }}
          >
            Eğitim Seti Seçiniz:
          </label>
          <select
            id="educationSetSelect"
            className="form-select"
            value={educationSetId}
            onChange={handleChange}
            style={{ maxWidth: "300px" }} // opsiyonel, genişlik sınırı için
          >
            <option value="">-- Eğitim Seti Seçiniz --</option>
            {educationSets?.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-primary ms-3"
            onClick={() => navigate("/admin/certificate-result")}
          >
            Sertifikaları Görüntüle
          </button>
        </div>

        {educationSetId && (
          <>
            <h2 className="mt-5 mb-3">Bu seti tamamlayan kullanıcılar:</h2>
            {loading && (
              <div className="alert alert-info" role="alert">
                Yükleniyor...
              </div>
            )}
            {users.length > 0 ? (
              <>
                <div
                  className="table-responsive"
                  style={{ borderRadius: "12px", overflow: "hidden" }}
                >
                  <table
                    className="table align-middle table-hover"
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: "0 6px",
                    }}
                  >
                    <thead style={{ backgroundColor: "#f5f7fa" }}>
                      <tr>
                        <th scope="col">
                          <input
                            type="checkbox"
                            title="Tümünü Seç"
                            checked={
                              users.length > 0 &&
                              users.every(
                                (item) => selectedCertificates[item.user?.id]
                              )
                            }
                            onChange={(e) => onToggleAll(e.target.checked)}
                          />
                        </th>
                        <th scope="col">ID Card Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Surname</th>
                        <th scope="col">Kurs</th>
                        <th scope="col">Kurs Adı</th>
                        <th scope="col">Kurum</th>
                        <th scope="col">Eğitim Talep Eden Yetkili</th>
                        <th scope="col">Eğitim Tarihi</th>
                        <th scope="col">Eğitmen</th>
                        <th scope="col">Açıklama</th>
                        <th scope="col">Sertifika Numarası</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => {
                        const user = item.user || {};
                        return (
                          <tr
                            key={user.id}
                            style={{
                              backgroundColor: "#ffffff",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              borderRadius: "8px",
                            }}
                          >
                            <td>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={!!selectedCertificates[user.id]}
                                onChange={() => toggleSelect(user.id)}
                              />
                            </td>
                            <td>{user.tcno || "-"}</td>
                            <td>{user.ad || "-"}</td>
                            <td>{user.soyad || "-"}</td>
                            <td>
                              {item.EducationSet?.educations?.[0]?.name || "-"}
                            </td>
                            <td>{item.EducationSet?.name || "-"}</td>
                            <td>{"Tav Güvenlik"}</td>
                            <td>{`${requester.ad || "-"} ${
                              requester.soyad || ""
                            }`}</td>
                            <td>
                              {formatDateTime(item.entry_date, item.entry_time)}
                            </td>
                            <td>{item.educator || "-"}</td>
                            <td>{"Başarılı"}</td>
                            <td>{`TAV/FRONTEND/${user.id
                              .toString()
                              .padStart(6, "0")}`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  className="btn btn-primary mt-3"
                  onClick={handleCreateCertificates}
                >
                  Sertifika Oluştur
                </button>
              </>
            ) : (
              <p>Bu eğitim setini tamamlayan kullanıcı bulunamadı.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
