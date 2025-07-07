import React, { useEffect } from "react";
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

  if (!userEducationResultDetail?.data) {
    return <p className="text-center mt-5">Yükleniyor veya veri yok...</p>;
  }

  const data = userEducationResultDetail.data;

  const user = data.user || {};
  console.log(user);
  console.log(data);

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
      <th scope="row" className="w-50">
        {label}
      </th>
      <td>{value ?? "-"}</td>
    </tr>
  );

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
            Eğitim Seti Sonuçları
          </h1>
        </div>

        <div className="row">
          <div className="col-lg-8">
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
          <div className="col-lg-4">
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

          {/* Geri Dön */}
          <div className="text-center mt-5">
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
          </div>
        </div>
      </div>
    </div>
  );
}
