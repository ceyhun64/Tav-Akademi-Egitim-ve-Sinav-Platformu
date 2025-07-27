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
  const handleDelete = async () => {
    if (selectedFileIds.length === 0) {
      alert("Lütfen silmek için dosya seçin.");
      return;
    }
    await dispatch(deleteUploadedFileThunk(selectedFileIds));
    await dispatch(getUploadedFilesByManagerThunk());
    setSelectedFileIds([]); // Silme sonrası seçimi temizle
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true); // büyük ekranlarda sidebar açık
      } else {
        setSidebarOpen(false); // mobil/tablette kapalı
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile && !isTablet);
  }, [isMobile, isTablet]);

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
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>
      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{
          marginLeft: sidebarOpen ? 260 : 0,
          padding: "1rem",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? "1rem" : "0",
          }}
        >
          <h1
            className="mb-4 mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: isMobile ? "22px" : "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
              flexGrow: 1,
              whiteSpace: "nowrap",
            }}
          >
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: "1.6rem" }}
              ></i>
            )}
            Dosya Yükleme İşlemleri
          </h1>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: "#001b66",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: "1rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
              alignSelf: isMobile ? "stretch" : "auto",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Geri Dön
          </button>
        </div>

        <div
          className="card shadow-sm"
          style={{
            maxWidth: isMobile || isTablet ? "100%" : "1200px",
            width: isMobile || isTablet ? "100%" : "1100px",
            margin: "0 auto",
            borderRadius: "16px",
            padding: isMobile ? "1rem" : "2rem",
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
            backgroundColor: "#fff",
          }}
        >
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
                  className="btn btn-primary "
                  disabled={loading}
                  style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
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
            maxWidth: isMobile || isTablet ? "100%" : "1200px",
            width: isMobile || isTablet ? "100%" : "1100px",
            margin: "0 auto",
            borderRadius: "16px",
            padding: isMobile ? "1rem" : "2rem",
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
            backgroundColor: "#fff",
          }}
        >
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
