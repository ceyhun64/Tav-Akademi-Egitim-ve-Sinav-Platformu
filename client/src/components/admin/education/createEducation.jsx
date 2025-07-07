import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  uploadSingleThunk,
  uploadMultiplesThunk,
} from "../../../features/thunks/educationThunk";
import { useNavigate } from "react-router-dom";
import PdfDurationSetter from "./pageDuration";
import Sidebar from "../adminPanel/sidebar";

export default function CreateEducation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(""); // Duration başlangıçta boş string olabilir
  const [type, setType] = useState("");
  const [previewSingle, setPreviewSingle] = useState(null);
  const [previewMultiple, setPreviewMultiple] = useState([]);
  const [education, setEducation] = useState(null);
  const [message, setMessage] = useState(""); // Kullanıcıya mesaj göstermek için state
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu için state

  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    setSingleFile(file);
    setMessage(""); // Yeni dosya seçildiğinde mesajı temizle

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSingle(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSingle(null);
    }
  };

  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMultipleFiles(files);
    setMessage(""); // Yeni dosyalar seçildiğinde mesajı temizle

    const previews = [];
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setPreviewMultiple(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setPreviewMultiple([]);
    }
  };

  const handleSingleUpload = async () => {
    if (!singleFile || !name || !type) {
      setMessage("Lütfen dosya adı ve türü alanlarını doldurun.");
      return;
    }

    setIsLoading(true); // Yükleme başladı
    try {
      const formData = new FormData();
      formData.append("file", singleFile);
      formData.append("name", name);
      // Eğer duration boşsa 0 olarak ayarla, aksi takdirde mevcut değeri kullan
      formData.append("duration", duration === "" ? "0" : duration);
      formData.append("type", type);

      const result = await dispatch(uploadSingleThunk(formData)).unwrap();
      console.log("Yükleme başarılı:", result);
      setEducation(result);
      setId(result.newEducation.id); // Assuming newEducation has the id
      setMessage("Tekli dosya başarıyla yüklendi!");
    } catch (error) {
      setMessage(
        "Tekli dosya yüklenirken bir hata oluştu: " +
          (error.message || "Bilinmeyen Hata")
      );
      console.error("Tekli dosya yükleme hatası:", error);
    } finally {
      setIsLoading(false); // Yükleme bitti
    }
  };

  const handleMultipleUpload = async () => {
    if (!multipleFiles.length || !name || !type) {
      setMessage(
        "Lütfen dosya adı ve türü alanlarını doldurun ve en az bir dosya seçin."
      );
      return;
    }

    setIsLoading(true); // Yükleme başladı
    try {
      const formData = new FormData();
      multipleFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("name", name);
      // Eğer duration boşsa 0 olarak ayarla, aksi takdirde mevcut değeri kullan
      formData.append("duration", duration === "" ? "0" : duration);
      formData.append("type", type);

      await dispatch(uploadMultiplesThunk(formData)).unwrap();
      setMessage("Birden fazla dosya başarıyla yüklendi!");
      // Yükleme sonrası form alanlarını sıfırlayabilir veya yönlendirme yapabilirsiniz
      setMultipleFiles([]);
      setPreviewMultiple([]);
      setName("");
      setDuration("");
      setType("");
    } catch (error) {
      setMessage(
        "Birden fazla dosya yüklenirken bir hata oluştu: " +
          (error.message || "Bilinmeyen Hata")
      );
      console.error("Çoklu dosya yükleme hatası:", error);
    } finally {
      setIsLoading(false); // Yükleme bitti
    }
  };

  const handleDuration = () => {
    if (id) {
      navigate(`/admin/page-duration/${id}`);
    } else {
      setMessage("Önce tekli bir PDF eğitimi yüklemelisiniz.");
    }
  };

  return (
    <div className="poolteo-container" style={{ display: "flex" }}>
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
      </div>{" "}
      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2rem",
          backgroundColor: "#f8f9fc",
          minHeight: "100vh",
          flex: 1,
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
          <h2
            style={{
              color: "#001b66",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-clipboard-check-fill"
              style={{ marginRight: "8px" }}
            ></i>
            Eğitim Oluştur
          </h2>
        </div>{" "}
        {message && (
          <div
            className={`alert ${
              message.includes("hata") ? "alert-danger" : "alert-success"
            } mb-4`}
            role="alert"
          >
            {message}
          </div>
        )}
        {isLoading && (
          <div
            className="alert alert-info text-center d-flex align-items-center justify-content-center mb-4"
            role="status"
          >
            <span
              className="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            <span>Dosyalar yükleniyor, lütfen bekleyin...</span>
          </div>
        )}
        <div className="card shadow-sm p-4 mb-4">
          <div className="mb-3">
            <label htmlFor="educationName" className="form-label">
              Ad:
            </label>
            <input
              type="text"
              id="educationName"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading} // Yükleme sırasında devre dışı bırak
            />
          </div>
          <div className="mb-3">
            <label htmlFor="educationType" className="form-label">
              Tür:
            </label>
            <select
              id="educationType"
              className="form-select"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value !== "video") {
                  setDuration("0"); // Tür video değilse duration'ı sıfırla
                }
              }}
              disabled={isLoading} // Yükleme sırasında devre dışı bırak
            >
              <option value="" disabled>
                Tür Seçin
              </option>
              <option value="pdf">Döküman</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="educationDuration" className="form-label">
              Süre (dakika):
            </label>
            <input
              type="number" // Sayısal giriş için number type
              id="educationDuration"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={type !== "video" || isLoading} // Sadece video türü seçilince ve yükleme yokken enable
              placeholder="Video süresi (dakika)"
            />
          </div>
        </div>
        <div className="card shadow-sm p-4 mb-4">
          <h3 className="mb-3">Tekli Dosya Yükle</h3>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept=".jpg,.jpeg,.png,.webp,.pdf,.ppt,.pptx,.mp4,.mov,.avi,.docx,.xlsx"
              onChange={handleSingleFileChange}
              disabled={isLoading} // Yükleme sırasında devre dışı bırak
            />
          </div>
          <button
            onClick={handleSingleUpload}
            className="btn btn-primary"
            disabled={isLoading}
          >
            Yükle
          </button>

          {previewSingle && (
            <div className="mt-3 text-center">
              {singleFile?.type.startsWith("image/") && (
                <img
                  src={previewSingle}
                  alt="Seçilen dosya önizlemesi"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
              )}
              {singleFile?.type === "application/pdf" && (
                <p className="text-muted">PDF dosyası seçildi.</p>
              )}
              {singleFile?.type.startsWith("video/") && (
                <video
                  src={previewSingle}
                  controls
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
              )}
            </div>
          )}

          {type === "pdf" &&
            singleFile &&
            education &&
            education.newEducation && (
              <div className="mt-3">
                <PdfDurationSetter
                  education={education.newEducation}
                  pages={education.pages}
                />
              </div>
            )}
        </div>
        <div className="card shadow-sm p-4">
          <h3 className="mb-3">Birden Fazla Dosya Yükle (Sadece Görseller)</h3>
          <div className="mb-3">
            <input
              type="file"
              multiple
              className="form-control"
              accept=".jpg,.jpeg,.png,.webp,.ppt,.pptx"
              onChange={handleMultipleFileChange}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleMultipleUpload}
            className="btn btn-primary"
            disabled={isLoading}
          >
            Yükle
          </button>
          {previewMultiple.length > 0 && (
            <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">
              {previewMultiple.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Önizleme ${index}`}
                  className="img-thumbnail" // Bootstrap küçük resim stili
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
