import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCertificatesThunk } from "../../../features/thunks/certificateThunk";
import Sidebar from "../adminPanel/sidebar";
import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";
import { saveAs } from "file-saver";

function Modal({ visible, onClose, children }) {
  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(124, 124, 124, 0.33)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          padding: "1.5rem 2rem",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div>
          {children}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
          >
            <button
              onClick={onClose}
              style={{
                backgroundColor: "#001b66",
                border: "none",
                color: "white",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: "0 3px 6px rgba(0, 27, 102, 0.4)",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#003399")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#001b66")
              }
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificateResult() {
  const dispatch = useDispatch();
  const { certificates, loading, error } = useSelector(
    (state) => state.certificate
  );

  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    surname: "",
    education_name: "",
    education_date: "",
    certificate_number: "",
    educatorName: "",
    institution: "",
  });

  useEffect(() => {
    dispatch(getCertificatesThunk());
  }, [dispatch]);

  const filteredCertificates = certificates
    ? certificates.filter((cert) =>
        Object.entries(filters).every(([key, val]) =>
          cert[key]?.toString().toLowerCase().includes(val.toLowerCase())
        )
      )
    : [];

  const handleRowClick = (cert) => {
    setSelectedCertificate(cert);
  };

  const toggleSelectAll = (checked) => {
    if (checked) setSelectedIds(filteredCertificates.map((c) => c.id));
    else setSelectedIds([]);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
            Sertifikalar
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "50px", // sağa itmek için
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>
        {loading && (
          <div
            style={{
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              color: "#0c5460",
              backgroundColor: "#d1ecf1",
              borderRadius: 4,
            }}
          >
            Yükleniyor...
          </div>
        )}
        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              color: "#721c24",
              backgroundColor: "#f8d7da",
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 27, 102, 0.1)",
            backgroundColor: "white",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 6px",
              fontSize: "0.9rem",
            }}
            className="table align-middle table-hover"
          >
            <thead
              style={{
                backgroundColor: "#f5f7fa",
                color: "#001b66",
                fontWeight: 600,
              }}
            >
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    title="Tümünü Seç"
                    checked={
                      filteredCertificates.length > 0 &&
                      selectedIds.length === filteredCertificates.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                {[
                  { key: "name", label: "Ad" },
                  { key: "surname", label: "Soyad" },
                  { key: "certificate_number", label: "Sertifika No" },
                  !isMobile && { key: "education_name", label: "Kurs" },
                  !isMobile && {
                    key: "education_date",
                    label: "Eğitim Tarihi",
                  },
                  !isMobile && { key: "educatorName", label: "Eğitmen" },
                  !isMobile && { key: "institution", label: "Kurum" },
                ]
                  .filter(Boolean)
                  .map(({ key, label }) => (
                    <th key={key}>
                      {!isMobile && (
                        <input
                          type="text"
                          name={key}
                          placeholder={label}
                          value={filters[key]}
                          onChange={handleFilterChange}
                          style={{
                            border: "none",
                            backgroundColor: "#f5f7fa",
                            fontSize: "0.85rem",
                            padding: "5px 8px",
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            width: "100%",
                            boxSizing: "border-box",
                            color: "#001b66",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = "none";
                            e.currentTarget.style.borderColor = "#001b66";
                            e.currentTarget.style.boxShadow =
                              "0 0 5px rgba(0, 27, 102, 0.5)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#ccc";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      )}
                      {isMobile && label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert) => (
                  <tr
                    key={cert.id}
                    onClick={() => handleRowClick(cert)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRowClick(cert);
                    }}
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cert.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectOne(cert.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{cert.name}</td>
                    <td>{cert.surname}</td>
                    <td>{cert.certificate_number}</td>
                    {!isMobile && <td>{cert.education_name}</td>}
                    {!isMobile && <td>{cert.education_date}</td>}
                    {!isMobile && <td>{cert.educatorName}</td>}
                    {!isMobile && <td>{cert.institution}</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isMobile ? 4 : 8}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    Sertifika bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          visible={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        >
          {selectedCertificate && (
            <>
              <h2
                style={{
                  marginBottom: "1rem",
                  color: "#001b66",
                  fontWeight: 700,
                }}
              >
                {selectedCertificate.name} {selectedCertificate.surname}
              </h2>
              <p>
                <strong>Kurs:</strong> {selectedCertificate.education_name}
              </p>
              <p>
                <strong>Eğitim Tarihi:</strong>{" "}
                {selectedCertificate.education_date}
              </p>
              <p>
                <strong>Sertifika No:</strong>{" "}
                {selectedCertificate.certificate_number}
              </p>
              <p>
                <strong>Eğitmen:</strong> {selectedCertificate.educatorName}
              </p>
              <p>
                <strong>Kurum:</strong> {selectedCertificate.institution}
              </p>
              <p>
                <strong>Yorum:</strong> {selectedCertificate.comment || "-"}
              </p>
              <p>
                <strong>Sertifika Linki:</strong>{" "}
                <a
                  href={selectedCertificate.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0047b3", // Daha canlı bir mavi
                    fontWeight: 700, // Daha kalın font
                    fontSize: "1.1rem", // Biraz daha büyük font
                    textDecoration: "underline", // Altını çiz
                    transition: "color 0.3s ease, transform 0.2s ease",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#002966"; // Daha koyu mavi
                    e.currentTarget.style.transform = "scale(1.05)"; // Hafif büyütme
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#0047b3";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Sertifikayı Görüntüle
                </a>
              </p>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
