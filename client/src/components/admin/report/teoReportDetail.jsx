import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserResultDetailThunk } from "../../../features/thunks/reportThunk";
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

export default function TeoReportDetail() {
  const { userId, examId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userResultDetail } = useSelector((state) => state.report);
  const { groups, institutions } = useSelector((state) => state.grpInst);

  const { data } = userResultDetail || {};

  useEffect(() => {
    if (userId && examId) {
      dispatch(getUserResultDetailThunk({ userId, examId }));
    }
  }, [dispatch, userId, examId]);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  if (!data) return <p className="text-center mt-5">Yükleniyor...</p>;

  const user = data.user || {};
  const exam = data.exam || {};

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
      <th scope="row" className="w-50">
        {label}
      </th>
      <td>{value ?? "-"}</td>
    </tr>
  );

  const passMessage = data.pass
    ? " Tebrikler, sınavı geçtiniz!"
    : " Üzgünüz, sınavda başarısız oldunuz.";

  return (
    <div
      className="poolteo-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden",
        backgroundColor: "#f4f6fc",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "2rem 1.5rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.2)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 16px 16px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)", // 👈 bu kritik

          padding: "3rem 3.5rem",
          transition: "margin-left 0.3s ease",
          color: "#222",
        }}
      >
        {/* Başlık */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1
            style={{
              color: "#001b66",
              fontSize: "30px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
            }}
          >
            <i
              className="bi bi-clipboard-check-fill"
              style={{ fontSize: "1.8rem" }}
            ></i>
            Teorik Sınav Sonuçları
          </h1>
        </div>

        <div className="row">
          {/* Sol Panel */}
          <div className="col-lg-8">
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
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0"
              style={{ minWidth: "400px" }}
            >
              <div
                className="card-header text-white text-center fw-semibold"
                style={{ backgroundColor: "#001b66" }}
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
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2"
                onClick={() => navigate(-1)}
              >
                <i
                  className="bi bi-arrow-left-circle"
                  style={{ color: "white" }}
                ></i>
                Geri Dön
              </button>

              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2"
                onClick={() =>
                  navigate(`/admin/teo-question-report/${userId}/${examId}`)
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
