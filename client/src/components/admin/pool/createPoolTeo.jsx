import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPoolTeoThunk } from "../../../features/thunks/poolTeoThunk";
import QuestionEditor from "./questionEditor";
import { getDifLevelsThunk } from "../../../features/thunks/queDifThunk";
import { getTeoBookletsThunk } from "../../../features/thunks/bookletThunk";
import Sidebar from "../adminPanel/sidebar";
import "./createPoolTeo.css";

export default function CreatePoolTeo() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
    answer: "",
    bookletId: "",
    difLevelId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const { difLevels } = useSelector((state) => state.queDif);
  const { teoBooklets } = useSelector((state) => state.booklet);

  useEffect(() => {
    dispatch(getTeoBookletsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDifLevelsThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleQuestionChange = (newContent) => {
    setForm((prev) => ({ ...prev, question: newContent }));
  };

  const handleSubmit = () => {
    if (!form.question || !form.answer || !form.bookletId || !form.difLevelId) {
      return alert("Lütfen gerekli alanları doldurun.");
    }

    const formData = new FormData();
    formData.append("question", form.question);

    Object.entries(form)
      .filter(([key]) => key !== "question")
      .forEach(([key, value]) => {
        formData.append(key, value);
      });

    if (imageFile) {
      formData.append("file", imageFile);
    }

    dispatch(createPoolTeoThunk(formData))
      .unwrap() // thunk fulfilled/rejected ayrımı için
      .then(() => {
        window.alert("Soru başarıyla kaydedildi!");
        // İstersen formu sıfırlayabilirsin:
        // resetForm();
      })
      .catch((error) => {
        console.error("Kayıt hatası:", error);
        window.alert("Soru kaydedilirken bir hata oluştu.");
      });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // < 768px
  const [isTablet, setIsTablet] = useState(false); // 768px - 1200px
  const TABLET_BREAKPOINT = 768;
  const DESKTOP_BREAKPOINT = 1200;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < TABLET_BREAKPOINT);
      setIsTablet(width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT);
      // Büyük ekranda sidebar açık kalsın, küçükte kapalı
      setSidebarOpen(width >= TABLET_BREAKPOINT); // Tablet ve masaüstünde açık
    };

    handleResize(); // İlk render'da boyutları ayarla
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik
  const gridTemplateColumnsStyle = isMobile || isTablet ? "1fr" : "2fr 1fr";

  return (
    <div className="poolImg-container" style={{ overflowX: "hidden" }}>
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
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
      >
        <h2
          className="mb-4 mt-4 ms-4 d-flex align-items-center"
          style={{
            fontWeight: "600",
            fontSize: "1.5rem",
            color: "#001b66",
            gap: "10px",
            justifyContent: "flex-start",
          }}
        >
          <i
            className="bi bi-pencil-square"
            style={{ fontSize: "1.6rem", color: "#001b66" }}
          ></i>
          Teorik Soru Ekle
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
        </h2>

        {/* İçerik */}
        <div
          className="content-columns"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile || isTablet ? "1fr" : "2fr 1fr", // <-- burası değişti
            gap: isMobile ? "10px" : "20px",
          }}
        >
          {" "}
          {/* Sol sütun */}
          <div className="left-column">
            {/* İçerik */}
            <div
              className="d-flex flex-wrap align-items-center gap-2"
              style={{ marginTop: 10 }}
            >
              <label htmlFor="imageInput" className="form-label">
                Görsel
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="imageInput"
                onChange={handleFileChange}
              />
            </div>

            {previewURL && (
              <div className="mb-3 mt-3">
                <img
                  src={previewURL}
                  alt="Seçilen görsel"
                  className="img-fluid rounded border"
                  style={{ maxHeight: 500, objectFit: "contain" }}
                />
              </div>
            )}

            <div className="mb-3 mt-3">
              <QuestionEditor
                value={form.question}
                onChange={handleQuestionChange}
              />
            </div>
          </div>
          {/* Sağ sütun */}
          <div
            className="right-column"
            style={{
              display: isMobile ? "flex" : "block",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {["a", "b", "c", "d", "e"].map((field) => (
              <div
                key={field}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  width: isMobile ? "90%" : 300,
                  justifyContent: isMobile ? "center" : "flex-start",
                  cursor: "pointer",
                }}
              >
                {/* Sol harf kutusu */}
                <div
                  onClick={() =>
                    setForm((prev) => ({ ...prev, answer: field }))
                  }
                  style={{
                    width: 40,
                    backgroundColor:
                      form.answer === field ? "#001b66" : "#e2e8f0",
                    color: form.answer === field ? "#fff" : "#001b66",
                    padding: "10px",
                    textAlign: "center",
                    marginBottom: 15,
                    fontWeight: "bold",
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    transition: "all 0.2s ease-in-out",
                    flexShrink: 0,
                    userSelect: "none",
                  }}
                  title="Doğru cevabı seç"
                >
                  {field.toUpperCase()}
                </div>

                {/* Sağ input alanı */}
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  style={{
                    width: selectWidth,
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderLeft: "none",
                    marginBottom: 15,
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    fontSize: 14,
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#cbd5e1")
                  }
                  placeholder="Seçenek Giriniz"
                />
              </div>
            ))}

            {/* Kitapçık seçimi */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "inline-block", width: 120 }}>
                Kitapçık
              </label>
              <select
                id="bookletId"
                name="bookletId"
                value={form.bookletId}
                onChange={handleChange}
                required
                style={{
                  padding: 10,
                  width: selectWidth,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#001b66")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
              >
                <option value="">Seçiniz</option>
                {teoBooklets.map((booklet) => (
                  <option key={booklet.id} value={booklet.id}>
                    {booklet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zorluk Seviyesi */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "inline-block", width: 120 }}>
                Zorluk Seviyesi
              </label>
              <select
                id="difLevelId"
                name="difLevelId"
                value={form.difLevelId}
                onChange={handleChange}
                style={{
                  padding: 10,
                  width: selectWidth,
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#001b66")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
              >
                <option value="">Seçiniz</option>
                {difLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              style={{
                marginTop: 10,
                backgroundColor: "#001b66",
                color: "#fff",
                border: "none",
                padding: "12px 30px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 5px 15px #001b66cc",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003399")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#001b66")
              }
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
