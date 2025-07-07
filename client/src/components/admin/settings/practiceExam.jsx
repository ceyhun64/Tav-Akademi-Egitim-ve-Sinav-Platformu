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

  return (
    <div
      className="poolteo-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden", // yatay kaymayı engeller
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1.5rem 1.2rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#003399", // biraz daha canlı mavi
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2.5rem 3rem",
          backgroundColor: "#f4f6fc",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          color: "#222",
        }}
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
            <i
              className="bi bi-clipboard-check-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Pratik Sınavlar
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
                <input
                  type="number"
                  className="form-control"
                  placeholder="Süre (dakika)"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
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
                    Süre: {item.duration} dk, Soru Sayısı: {item.question_count}
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
