import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserEducationResultDetailThunk } from "../../../features/thunks/reportThunk";
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

export default function EducationReportDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // All Hooks must be called unconditionally at the top level of the component
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { userId, educationSetId } = useParams();
  const { userEducationResultDetail } = useSelector((state) => state.report);
  const { groups, institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    if (userId && educationSetId) {
      dispatch(getUserEducationResultDetailThunk({ userId, educationSetId }));
    }
  }, [dispatch, userId, educationSetId]);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

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

  const selectWidth = 300; // This variable isn't used. Consider removing it if it's not needed.

  // --- Crucial Change: Add a loading check here ---
  if (!userEducationResultDetail || !userEducationResultDetail.data) {
    return <p className="text-center mt-5">Yükleniyor...</p>;
  }

  // Now, we are certain that userEducationResultDetail.data exists.
  const data = userEducationResultDetail.data;
  const user = data.user || {}; // Safely access user
  // console.log(user); // You can keep these for debugging if needed
  // console.log(data); // You can keep these for debugging if needed

  const getGroupName = (id) => {
    const group = groups.find((g) => g.id === id);
    return group ? group.name : "-";
  };

  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i.id === id);
    return inst ? inst.name : "-";
  };

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
            Eğitim Seti Sonuçları
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
        <div className="row">
          <div className="col-lg-6">
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
                {/* Kullanıcı Bilgileri */}
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

            {/* Eğitim Seti Bilgileri */}
            <Card title="Eğitim Seti Bilgileri" color="#002a99">
              <InfoRow label="Eğitim Seti Adı" value={data.name || "-"} />
              <InfoRow
                label="Başlangıç Tarihi"
                value={data.start_date || "-"}
              />
              <InfoRow label="Bitiş Tarihi" value={data.end_date || "-"} />
              <InfoRow label="Başlangıç Saati" value={data.start_time || "-"} />
              <InfoRow label="Bitiş Saati" value={data.end_time || "-"} />
              <InfoRow
                label="Tamamlandı mı?"
                value={data.completed ? "✅ Evet" : "❌ Hayır"}
              />
            </Card>
          </div>

          {/* Sağ Panel - Puanlar */}
          <div className="col-lg-6">
            <Card title="Puan Bilgileri" color="#0033cc">
              <InfoRow
                label="Teorik Sınav Puanı"
                value={
                  data.passing_score_teo != null ? data.passing_score_teo : "-"
                }
              />
              <InfoRow
                label="Görüntü Sınav Puanı"
                value={
                  data.passing_score_img != null ? data.passing_score_img : "-"
                }
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
