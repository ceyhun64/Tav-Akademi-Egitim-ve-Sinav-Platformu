import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCompletedEducationSetsThunk,
  createCertificateThunk,
} from "../../../features/thunks/certificateThunk";
import { getEducationSetsThunk } from "../../../features/thunks/educationSetThunk";
import Sidebar from "../adminPanel/sidebar";
import { useNavigate } from "react-router-dom";
import {
  getCourseNosThunk,
  getCourseTypesThunk,
  getEducatorsThunk,
  getRequestersThunk,
} from "../../../features/thunks/certificateThunk";

export default function Certificate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    completedEducationSets,
    educators,
    courseNos,
    courseTypes,
    requesters,
    loading,
    error,
  } = useSelector((state) => state.certificate);
  const { educationSets, loading: educationLoading } = useSelector(
    (state) => state.educationSet
  );
  const [educationSetId, setEducationSetId] = useState("");
  const [selectedCertificates, setSelectedCertificates] = useState({});
  const [courseCode, setCourseCode] = useState("");
  const [educationType, setEducationType] = useState("");
  const [educationName, setEducationName] = useState("");
  const [educationSetName, setEducationSetName] = useState("");
  const [certificateBaseNo, setCertificateBaseNo] = useState(""); // Kullanıcının ilk gireceği no
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [educator, setEducator] = useState("");
  const [requestingOfficer, setRequestingOfficer] = useState("");

  useEffect(() => {
    dispatch(getEducationSetsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCourseNosThunk());
    dispatch(getCourseTypesThunk());
    dispatch(getEducatorsThunk());
    dispatch(getRequestersThunk());
  }, [dispatch]);

  useEffect(() => {
    if (educationSetId) {
      dispatch(getCompletedEducationSetsThunk(educationSetId));
      setSelectedCertificates({});
    }
  }, [educationSetId, dispatch]);

  const handleChange = (e) => {
    setEducationSetId(e.target.value);
    setEducationSetName(e.target.value);
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
    const selectedUsers = users.filter(
      (item) => selectedCertificates[item.user.id]
    );

    if (selectedUsers.length === 0) {
      alert("Lütfen en az bir kullanıcı seçiniz.");
      return;
    }

    if (!certificateBaseNo.includes("/")) {
      alert(
        "Geçerli bir başlangıç sertifika numarası giriniz (örneğin TAV/001)."
      );
      return;
    }

    // Ön eki ve numarayı ayır
    const parts = certificateBaseNo.split("/");
    if (parts.length !== 2) {
      alert(
        "Geçerli bir başlangıç sertifika numarası giriniz (örneğin TAV/001)."
      );
      return;
    }

    const prefix = parts[0] + "/";
    const numberPart = parts[1];

    // Numarayı sayıya çevir (başındaki sıfırlar olabilir)
    const baseNumber = parseInt(numberPart, 10);

    if (isNaN(baseNumber)) {
      alert("Sertifika numarasının sonunda geçerli bir sayı olmalıdır.");
      return;
    }

    // Numarayı sıfırlarla doldurmak için padding uzunluğunu al
    const numberLength = numberPart.length;

    const certificates = selectedUsers.map((item, index) => {
      const user = item.user || {};
      // Yeni numarayı oluştur, başına sıfır ekle
      const newNumber = (baseNumber + index)
        .toString()
        .padStart(numberLength, "0");

      return {
        tc: user.tcno,
        name: user.ad,
        surname: user.soyad,
        education_name: educationName,
        educationSet_name: educationSetName, // ← bunu ekle

        course_no: courseCode,
        requester: requestingOfficer,
        education_date: startDate,
        educationSet_end_date: endDate,
        educatorName: educator,
        comment: "Başarılı",
        certificate_number: `${prefix}${newNumber}`, // prefix + yeni numara
        exam_date: item.exam_date || "",
        institution: "Tav Güvenlik",
      };
    });

    dispatch(createCertificateThunk({ certificates }));
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
            className=" mt-2 ms-5"
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
            Sertifika Oluştur
          </h1>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 6px 15px rgba(0, 27, 102, 0.1)",
            marginBottom: "30px",
          }}
        >
          <h5
            style={{
              color: "#001b66",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-journal-check"
              style={{ marginRight: "6px" }}
            ></i>
            Sertifika Detayları
          </h5>

          <div className="row">
            {/* Satır 1 */}
            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Kurs No
              </label>
              <select
                className="form-select"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {courseNos.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Kurs Türü
              </label>
              <select
                className="form-select"
                value={educationType}
                onChange={(e) => setEducationType(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {courseTypes.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Eğitim Adı
              </label>
              <select
                className="form-select"
                value={educationName}
                onChange={(e) => setEducationName(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {educationSets?.map((e) => (
                  <option key={e.id} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Satır 2 */}
            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Sertifika Başlangıç No
              </label>
              <input
                type="text"
                className="form-control"
                value={certificateBaseNo}
                onChange={(e) => setCertificateBaseNo(e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Bitiş Tarihi
              </label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Satır 3 */}
            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Eğitmen
              </label>
              <select
                className="form-select"
                value={educator}
                onChange={(e) => setEducator(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {educators.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Talep Eden
              </label>
              <select
                className="form-select"
                value={requestingOfficer}
                onChange={(e) => setRequestingOfficer(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {requesters.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label
                className="form-label"
                style={{ fontWeight: "700", color: "#001b66" }}
              >
                Eğitim Seti Seçiniz
              </label>
              <select
                id="educationSetSelect"
                className="form-select"
                value={educationSetId}
                onChange={handleChange}
              >
                <option value="">-- Eğitim Seti Seçiniz --</option>
                {educationSets?.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          className="btn btn-sm btn-primary ms-2"
          style={isMobile ? { marginBottom: "10px" } : {}}
          onClick={() => navigate("/admin/certificate-inputs")}
        >
          Sertifika Seçeneklerini Düzenle
        </button>
        <button
          className="btn btn-sm btn-primary ms-2"
          onClick={() => navigate("/admin/certificate-result")}
        >
          Sertifikaları Görüntüle
        </button>

        <div
          className="mt-4"
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 6px 15px rgba(0, 27, 102, 0.1)",
            marginBottom: "30px",
          }}
        >
          <h5
            style={{
              color: "#001b66",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-journal-check"
              style={{ marginRight: "6px" }}
            ></i>
            Eğitim Setini Tamamlayan Kullanıcılar
          </h5>

          {!educationSetId ? (
            <div className="alert alert-warning" role="alert">
              Lütfen bir eğitim seti seçiniz.
            </div>
          ) : loading ? (
            <div className="alert alert-info" role="alert">
              Yükleniyor...
            </div>
          ) : users.length > 0 ? (
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
                      <th scope="col">TC No</th>
                      <th scope="col">Ad</th>
                      <th scope="col">Soyad</th>
                      <th scope="col" className="d-none d-md-table-cell">
                        Kurs
                      </th>
                      <th scope="col" className="d-none d-md-table-cell">
                        Kurs Adı
                      </th>
                      <th scope="col" className="d-none d-md-table-cell">
                        Kurum
                      </th>
                      <th scope="col" className="d-none d-md-table-cell">
                        Eğitim Tarihi
                      </th>
                      <th scope="col" className="d-none d-md-table-cell">
                        Açıklama
                      </th>
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
                          <td className="d-none d-md-table-cell">
                            {item.EducationSet?.educations?.[0]?.name || "-"}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {item.EducationSet?.name || "-"}
                          </td>
                          <td className="d-none d-md-table-cell">
                            Tav Güvenlik
                          </td>
                          <td className="d-none d-md-table-cell">
                            {formatDateTime(item.entry_date, item.entry_time)}
                          </td>
                          <td className="d-none d-md-table-cell">Başarılı</td>
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
        </div>
      </div>
    </div>
  );
}
