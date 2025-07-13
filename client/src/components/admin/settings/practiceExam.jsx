import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPracticeExamThunk,
  createPracticeExamThunk,
  updatePracticeExamThunk,
  deletePracticeExamThunk,
} from "../../../features/thunks/practiceExamThunk";
import Sidebar from "../adminPanel/sidebar";

export default function PracticeExam() {
  const dispatch = useDispatch();
  const { practiceExam, isLoading, error } = useSelector(
    (state) => state.practiceExam
  );

  const [formData, setFormData] = useState({
    duration: "",
    question_count: "",
    id: null, // güncelleme için
  });

  useEffect(() => {
    dispatch(getPracticeExamThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      duration: parseInt(formData.duration),
      question_count: parseInt(formData.question_count),
    };

    if (formData.id) {
      dispatch(updatePracticeExamThunk({ id: formData.id, ...data }));
    } else {
      dispatch(createPracticeExamThunk(data));
    }

    setFormData({ duration: "", question_count: "", id: null });
  };

  const handleEdit = (item) => {
    setFormData({
      duration: item.duration,
      question_count: item.question_count,
      id: item.id,
    });
  };

  const handleDelete = (id) => {
    dispatch(deletePracticeExamThunk(id));
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
            Pratik Sınavlar
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
            maxWidth: "1000px",
            margin: "0 auto",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
            backgroundColor: "#fff",
          }}
        >
          <div className="card-body">
            <h2 className="card-title mb-4">Sınav Oluştur / Güncelle</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-4 row g-3">
              <div className="col-md-6">
                <label htmlFor="duration" style={{ fontWeight: "500" }}>
                  Süre (sn)
                </label>
                <select
                  id="duration"
                  className="custom-select"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    marginTop: "5px",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Süresiz seçeneği */}
                  <option value="0">Süresiz</option>

                  {/* 5'ten 15'e kadar 1'erli artış */}
                  {Array.from({ length: 11 }, (_, i) => 5 + i).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}

                  {/* 20'den 100'e kadar 5'erli artış */}
                  {Array.from({ length: 17 }, (_, i) => 20 + i * 5).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="duration" style={{ fontWeight: "500" }}>
                  Soru Sayısı
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Soru Sayısı"
                  name="question_count"
                  value={formData.question_count}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <button
                  className={`btn ${
                    formData.id ? "btn-warning" : "btn-primary"
                  }`}
                  type="submit"
                >
                  {formData.id ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>

            {/* Liste */}
            <h4 className="mb-3">Kayıtlı Sınavlar</h4>
            {isLoading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : practiceExam.length === 0 ? (
              <p>Kayıtlı sınav yok.</p>
            ) : (
              <ul className="list-group">
                {practiceExam.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    Süre:{" "}
                    {item.duration === 0 ? "Süresiz" : `${item.duration} dk`},
                    Soru Sayısı: {item.question_count}
                    <div>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
