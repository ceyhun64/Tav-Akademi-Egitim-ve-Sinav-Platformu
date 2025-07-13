import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  updatePoolTeoThunk,
  getPoolTeoByIdThunk,
} from "../../../features/thunks/poolTeoThunk";
import QuestionEditor from "./questionEditor";
import {
  getDifLevelsThunk,
  getQuestionCatThunk,
} from "../../../features/thunks/queDifThunk";
import { getTeoBookletsThunk } from "../../../features/thunks/bookletThunk";
import Sidebar from "../adminPanel/sidebar";

export default function UpdatePoolTeo() {
  const { id } = useParams();
  const { poolTeo } = useSelector((state) => state.poolTeo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getPoolTeoByIdThunk(id));
    }
  }, [dispatch, id]);

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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

  const { teoBooklets } = useSelector((state) => state.booklet);
  const { difLevels } = useSelector((state) => state.queDif);

  useEffect(() => {
    if (poolTeo) {
      setForm({
        question: poolTeo.question ?? "",
        a: poolTeo.a ?? "",
        b: poolTeo.b ?? "",
        c: poolTeo.c ?? "",
        d: poolTeo.d ?? "",
        e: poolTeo.e ?? "",
        answer: poolTeo.answer ?? "",
        bookletId:
          poolTeo.bookletId != null ? poolTeo.bookletId.toString() : "",
        difLevelId:
          poolTeo.difLevelId != null ? poolTeo.difLevelId.toString() : "",
      });

      setImage(poolTeo.image);
    }
  }, [poolTeo]);

  useEffect(() => {
    dispatch(getDifLevelsThunk());
    dispatch(getQuestionCatThunk());
    dispatch(getTeoBookletsThunk());
  }, [dispatch]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleQuestionChange = (content) =>
    setForm((f) => ({ ...f, question: content }));

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("file", imageFile);
      }

      formData.append("question", form.question);
      formData.append("bookletId", parseInt(form.bookletId));
      formData.append("difLevelId", parseInt(form.difLevelId));

      Object.entries(form).forEach(([key, value]) => {
        if (["bookletId", "difLevelId", "question"].includes(key)) return;
        formData.append(key, value);
      });

      dispatch(updatePoolTeoThunk({ id, formData }));
    } catch (error) {
      console.error("Gönderme hatası:", error);
      alert("Gönderme sırasında hata oluştu.");
    }
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
          Teorik Soru Güncelle
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
        </h2>

        <div
          className="content-columns"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            gap: isMobile ? "10px" : "20px",
          }}
        >
          <div className="left-column">
            <div className="mb-3">
              <label htmlFor="imageInput" className="form-label">
                Resim
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="imageInput"
                onChange={handleImageSelect}
              />
            </div>

            {image && (
              <div className="mb-3" ref={containerRef}>
                <img
                  ref={imageRef}
                  src={image}
                  alt="Main"
                  className="img-fluid rounded border"
                  style={{ maxHeight: 300, objectFit: "contain" }}
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

          {/* Sağ Sütun */}
          <div
            className="right-column"
            style={{
              display: isMobile ? "flex" : "block",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div>
              {["a", "b", "c", "d", "e"].map((option) => (
                <div
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    width: isMobile ? selectWidth : 300,
                    justifyContent: isMobile ? "center" : "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, answer: option }))
                  }
                >
                  <div
                    style={{
                      width: 40,
                      backgroundColor:
                        form.answer === option ? "#001b66" : "#e2e8f0",
                      color: form.answer === option ? "#fff" : "#001b66",
                      padding: "10px",
                      textAlign: "center",
                      marginBottom: 15,
                      fontWeight: "bold",
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                      userSelect: "none",
                      transition: "all 0.2s ease-in-out",
                      flexShrink: 0,
                    }}
                    title="Doğru cevabı seç"
                  >
                    {option.toUpperCase()}
                  </div>
                  <input
                    type="text"
                    name={option}
                    value={form[option]}
                    onChange={handleFormChange}
                    style={{
                      width: isMobile ? `calc(${selectWidth} - 40px)` : 260,
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
                <label
                  htmlFor="bookletId"
                  style={{ display: "inline-block", width: 120 }}
                >
                  Kitapçık
                </label>
                <select
                  id="bookletId"
                  name="bookletId"
                  className="form-select"
                  value={form.bookletId}
                  onChange={handleFormChange}
                  style={{
                    padding: 10,
                    width: selectWidth,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#cbd5e1")
                  }
                >
                  <option value="">Seçiniz</option>
                  {teoBooklets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zorluk Seviyesi */}
              <div style={{ marginBottom: 8 }}>
                <label
                  htmlFor="difLevelId"
                  style={{ display: "inline-block", width: 120 }}
                >
                  Zorluk Seviyesi
                </label>
                <select
                  id="difLevelId"
                  name="difLevelId"
                  className="form-select"
                  value={form.difLevelId}
                  onChange={handleFormChange}
                  style={{
                    padding: 10,
                    width: selectWidth,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#cbd5e1")
                  }
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
                Güncelle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
