import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserResultDetailThunk } from "../../../features/thunks/reportThunk";
import QuestionCategory from "./questionCategory";
import Sidebar from "../adminPanel/sidebar";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";

const Card = ({ title, color, children }) => (
  <div className="card mb-4 shadow-sm border-0">
    <div
      className="card-header text-white fw-semibold"
      style={{ backgroundColor: color }}
    >
      {title}
    </div>
    <div className="card-body p-0">
      <table className="table mb-0">
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);

export default function ImgReportDetail() {
  const { userId, examId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // All Hooks must be called unconditionally at the top level
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Hook 1: useState (isMobile)

  const { userResultDetail } = useSelector((state) => state.report); // Hook 2: useSelector
  const { groups, institutions } = useSelector((state) => state.grpInst); // Hook 3: useSelector

  // Data fetching effects
  useEffect(() => {
    // Hook 4: useEffect
    if (userId && examId) {
      dispatch(getUserResultDetailThunk({ userId, examId }));
    }
  }, [dispatch, userId, examId]);

  useEffect(() => {
    // Hook 5: useEffect
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  // Effects related to UI state (mobile responsiveness)
  useEffect(() => {
    // Hook 6: useEffect
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
    // Hook 7: useEffect
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // --- Now, perform the loading check after all Hooks are called ---
  if (!userResultDetail || !userResultDetail.data) {
    return <p className="text-center mt-5">Yükleniyor...</p>;
  }

  // Now we are sure that userResultDetail.data exists, so we can safely destructure it.
  const data = userResultDetail.data;

  const user = data.user || {};
  const exam = data.exam || {};

  const selectWidth = 300; // This variable isn't used. Consider removing it if it's not needed.

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
    if (minutes > 0 || hours > 0) result.push(`${minutes} dakika`);
    result.push(`${seconds} saniye`);

    return result.join(" ");
  }

  const getGroupName = (id) => {
    const group = groups.find((g) => g.id === id);
    return group ? group.name : "-";
  };

  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i.id === id);
    return inst ? inst.name : "-";
  };

  const duration = calculateDuration(
    data.entry_date,
    data.entry_time,
    data.exit_date,
    data.exit_time
  );

  const InfoRow = ({ label, value }) => (
    <tr>
      <td
        className="fw-semibold"
        style={{
          whiteSpace: "nowrap",
          width: "120px", // Etiket hücresi için sabit genişlik
          verticalAlign: "top",
          padding: "4px 8px",
        }}
      >
        {label}
      </td>
      <td style={{ padding: "4px 8px" }}>{value}</td>
    </tr>
  );

  const passMessage = data.pass
    ? " Tebrikler, sınavı geçtiniz!"
    : " Üzgünüz, sınavda başarısız oldunuz.";

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

        <div className="row">
          {/* Sol Panel */}
          <div className="col-lg-6">
            {/* Kullanıcı Bilgileri */}
            <Card title="Kullanıcı Bilgileri" color="#001b66">
              <div
                style={{ display: "flex", alignItems: "center", gap: "2rem" }}
              >
                {user.image && (
                  <div style={{ flexShrink: 0 }}>
                    <img
                      src={user.image}
                      alt="Kullanıcı"
                      width="100"
                      height="140"
                      className="border rounded shadow-sm"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <table className="table mb-0" style={{ marginBottom: 0 }}>
                  <tbody>
                    <InfoRow label="Ad" value={user.ad} />
                    <InfoRow label="Soyad" value={user.soyad} />
                    <InfoRow
                      label="Lokasyon"
                      value={getInstitutionName(user.lokasyonId)}
                    />
                    <InfoRow label="Grup" value={getGroupName(user.grupId)} />
                    <InfoRow label="Sicil" value={user.sicil} />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Sınav Bilgileri */}
            <Card title="Sınav Bilgileri" color="#002a99">
              <InfoRow label="Sınav Adı" value={exam.name} />
              <InfoRow
                label="Başlangıç"
                value={`${exam.start_date} ${exam.start_time}`}
              />
              <InfoRow
                label="Bitiş"
                value={`${exam.end_date} ${exam.end_time}`}
              />
              <InfoRow label="Süre (dk)" value={exam.sure} />
            </Card>

            {/* Katılım Bilgileri */}
            <Card title="Katılım Bilgileri" color="#0033cc">
              <InfoRow label="Giriş Tarihi" value={data.entry_date} />
              <InfoRow label="Giriş Saati" value={data.entry_time} />
              <InfoRow label="Çıkış Tarihi" value={data.exit_date} />
              <InfoRow label="Çıkış Saati" value={data.exit_time} />
              <InfoRow label="Geçirilen Süre" value={duration} />
            </Card>
          </div>

          {/* Sağ Panel */}
          <div className="col-lg-6">
            <div className="mb-4 mt-4">
              <QuestionCategory />
            </div>

            <div className="card shadow-sm border-0">
              <div
                className="card-header text-white text-center fw-semibold"
                style={{
                  backgroundColor: "#001b66",
                  maxWidth: isMobile ? "50%" : "400px",
                }}
              >
                Performans
              </div>
              <div className="card-body bg-white text-dark">
                <div className="text-center mb-3">
                  <h6>
                    Doğru: <strong>{data.true_count ?? 0}</strong>
                  </h6>
                  <h6>
                    Yanlış: <strong>{data.false_count ?? 0}</strong>
                  </h6>
                  <h6>
                    Toplam: <strong>{exam.question_count ?? "-"}</strong>
                  </h6>
                </div>
                <hr />
                <div className="text-center">
                  <p>
                    Geçme Notu: <strong>{exam.passing_score ?? "-"}</strong>
                  </p>
                  <p>
                    Alınan Puan: <strong>{data.score ?? "-"}</strong>
                  </p>
                </div>
                <hr />
                <div className="text-center">
                  <p
                    className={`fw-semibold ${
                      data.pass ? "text-success" : "text-danger"
                    }`}
                  >
                    {passMessage}
                  </p>
                </div>
                <div className="text-center mt-3">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: "#002a99",
                      color: "#fff",
                      fontSize: "0.9rem",
                      padding: "0.5em 1em",
                      borderRadius: "1rem",
                    }}
                  >
                    Tamamlandı mı? {data.completed ? "Evet" : "Hayır"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Geri Dön Butonları */}
          <div className="text-center mt-5">
            <div className="d-inline-flex flex-wrap gap-3 justify-content-center">
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2"
                onClick={() =>
                  navigate(`/admin/img-question-report/${userId}/${examId}`)
                }
              >
                <i className="bi bi-eye-fill"></i>
                İşaretlenen Cevapları Gör
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
