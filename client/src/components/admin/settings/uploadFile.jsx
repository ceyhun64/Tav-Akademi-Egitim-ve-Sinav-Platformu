import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFileThunk,
  uploadMultipleFilesThunk,
  getUploadedFilesByManagerThunk,
  deleteUploadedFileThunk,
} from "../../../features/thunks/uploadFileThunk";
import Sidebar from "../adminPanel/sidebar";

export default function UploadFile() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadType, setUploadType] = useState("single");

  const { uploadFiles, loading } = useSelector((state) => state.uploadFile);

  // Seçilen dosya id'lerini tutacak state
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  useEffect(() => {
    dispatch(getUploadedFilesByManagerThunk());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);

    if (uploadType === "single") {
      formData.append("file", files[0]);
      dispatch(uploadFileThunk(formData));
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      dispatch(uploadMultipleFilesThunk(formData));
    }
  };

  // Checkbox değişince selectedFileIds güncellenir
  const handleCheckboxChange = (id) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Tüm dosyaları seç / seçimi kaldır
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = uploadFiles.map((file) => file.id);
      setSelectedFileIds(allIds);
    } else {
      setSelectedFileIds([]);
    }
  };

  // Silme butonu tıklandığında seçilen id'leri gönder
  const handleDelete = () => {
    if (selectedFileIds.length === 0) {
      alert("Lütfen silmek için dosya seçin.");
      return;
    }
    dispatch(deleteUploadedFileThunk(selectedFileIds));
    setSelectedFileIds([]); // Silme sonrası seçimi temizle
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
  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik

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
            Dosya Yükleme İşlemleri
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
        <div
          className="card shadow-sm"
          style={{
            maxWidth: "1200px", // genişliği artırdım
            width: "1100px", // genişliği tam ekran yapıyor
            margin: "0 auto", // ortaya hizalama
            borderRadius: "16px", // biraz daha yuvarlak köşeler
            padding: "2rem", // içerik için padding artırıldı
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)", // daha belirgin gölge
            backgroundColor: "#fff",
          }}
        >
          {" "}
          <div className="card-body">
            <h4 className="card-title mb-4">Dosya Yükle</h4>
            <form onSubmit={handleSubmit}>
              <fieldset disabled={loading}>
                <div className="mb-3">
                  <label className="form-label">Yükleme Türü</label>
                  <select
                    className="form-select"
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                  >
                    <option value="single">Tekli Yükleme</option>
                    <option value="multiple">Çoklu Yükleme</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">İsim</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dosya adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dosya Seç</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple={uploadType === "multiple"}
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Yükleniyor , Lütfen Bekleyiniz...
                    </>
                  ) : (
                    "Gönder"
                  )}
                </button>
              </fieldset>
            </form>
          </div>
        </div>

        <div
          className="card shadow-sm mt-4"
          style={{
            maxWidth: "1200px", // genişliği artırdım
            width: "1100px", // genişliği tam ekran yapıyor
            margin: "0 auto", // ortaya hizalama
            borderRadius: "16px", // biraz daha yuvarlak köşeler
            padding: "2rem", // içerik için padding artırıldı
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)", // daha belirgin gölge
            backgroundColor: "#fff",
          }}
        >
          {" "}
          <div className="card-body">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "1rem" : "0",
                marginBottom: "1rem",
              }}
            >
              <h4 className="card-title mb-0">Yüklemeler</h4>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={selectedFileIds.length === 0}
              >
                Seçilenleri Sil
              </button>
            </div>

            {uploadFiles && uploadFiles.length > 0 ? (
              <div
                className="table-responsive"
                style={{
                  borderRadius: "16px",
                  overflowX: "auto",
                  maxWidth: "100%",
                  maxHeight: isMobile ? "none" : "800px",
                  boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  padding: isMobile ? "6px" : "12px",
                }}
              >
                <table
                  className="table align-middle table-hover"
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 6px",
                    minWidth: "100%",
                    tableLayout: "fixed",
                    fontSize: isMobile ? "0.75rem" : "1rem",
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: "#e9f1ff",
                      borderRadius: "12px",
                    }}
                  >
                    <tr
                      className="text-center align-middle"
                      style={{
                        fontWeight: "600",
                        color: "#334155",
                      }}
                    >
                      <th style={{ width: isMobile ? "30px" : "40px" }}>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            uploadFiles.length > 0 &&
                            selectedFileIds.length === uploadFiles.length
                          }
                        />
                      </th>
                      <th style={{ width: isMobile ? "30px" : "40px" }}>#</th>
                      <th style={{ width: isMobile ? "40%" : "auto" }}>İsim</th>
                      <th style={{ width: isMobile ? "30%" : "auto" }}>
                        Yükleme Tarihi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadFiles.map((file, index) => (
                      <tr
                        key={file.id}
                        style={{
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                          borderRadius: "10px",
                          cursor: "default",
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
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFileIds.includes(file.id)}
                            onChange={() => handleCheckboxChange(file.id)}
                          />
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="text-center"
                          style={{
                            verticalAlign: "middle",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {file.name}
                        </td>
                        <td
                          className="text-center"
                          style={{
                            verticalAlign: "middle",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {new Date(file.createdAt).toLocaleString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">Henüz dosya yüklenmedi.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
