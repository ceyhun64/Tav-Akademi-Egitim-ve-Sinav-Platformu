import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPdfWiewer from "./adminPdfWiewer"; // Doğru isimse
import { useDispatch, useSelector } from "react-redux";
import { getAllEducationsThunk } from "../../../features/thunks/educationThunk";

export default function EducationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { educations, loading, error } = useSelector(
    (state) => state.education
  );

  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    if (!educations.length) {
      dispatch(getAllEducationsThunk());
    }
  }, [dispatch, educations.length]);

  const education = educations.find((e) => e.id === parseInt(id));

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div className="spinner" />
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <p>Bir hata oluştu: {error}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#001b66",
            color: "white",
            cursor: "pointer",
          }}
        >
          Geri Dön
        </button>
      </div>
    );
  }

  if (!education) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Eğitim bulunamadı.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#001b66",
            color: "white",
            cursor: "pointer",
          }}
        >
          Geri Dön
        </button>
      </div>
    );
  }

  const fileType = education.file_url?.split(".").pop().toLowerCase();

  const renderContent = () => {
    if (fileError) {
      return (
        <p style={{ color: "red" }}>
          Dosya yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
      );
    }

    switch (fileType) {
      case "pdf":
        return <AdminPdfWiewer file={education.file_url} />;
      case "mp4":
        return (
          <video
            src={education.file_url}
            controls
            style={{ width: "100%", borderRadius: "8px" }}
            onError={() => setFileError(true)}
          />
        );
      case "ppt":
      case "pptx":
        return (
          <a
            href={education.file_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "16px 24px",
              border: "2px solid #d24726",
              backgroundColor: "#d24726",
              color: "white",
              fontWeight: "bold",
              borderRadius: "6px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b03c1e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#d24726")
            }
          >
            📊 PowerPoint Dosyasını Görüntüle / İndir
          </a>
        );
      default:
        return <p>Desteklenmeyen dosya türü.</p>;
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#001b66",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#003399")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#001b66")
        }
      >
        ← Geri Dön
      </button>

      <h2 style={{ color: "#001b66", marginBottom: "10px" }}>
        {education.name}
      </h2>
      <p>
        <strong>Süre:</strong> {education.duration}
      </p>
      <p>
        <strong>Tür:</strong> {education.type}
      </p>

      <div style={{ marginTop: "25px" }}>{renderContent()}</div>

      {/* Basit spinner CSS */}
      <style>{`
        .spinner {
          margin: 20px auto;
          width: 40px;
          height: 40px;
          border: 5px solid #ccc;
          border-top-color: #001b66;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
