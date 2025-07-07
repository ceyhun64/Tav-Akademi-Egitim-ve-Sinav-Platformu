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

  return (
    <div className="poolteo-container">
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
      </div>

      {/* İçerik */}
      <div className="poolteo-content" style={{ marginLeft: "260px" }}>
        <h2 className="mb-4 text-center">Teorik Soru Güncelle</h2>

        <div className="content-columns">
          {/* Sol Sütun */}
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

            <div className="mb-3">
              <label className="form-label">Soru</label>
              <QuestionEditor
                value={form.question}
                onChange={handleQuestionChange}
              />
            </div>
          </div>

          {/* Sağ Sütun */}
          <div className="right-column">
            {Object.entries(form).map(([field, value]) =>
              ["question", "bookletId", "difLevelId"].includes(field) ? null : (
                <div className="mb-3" key={field}>
                  <label htmlFor={field} className="form-label">
                    {field.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={field}
                    name={field}
                    value={value}
                    onChange={handleFormChange}
                  />
                </div>
              )
            )}

            <div className="mb-3">
              <label htmlFor="bookletId" className="form-label">
                Kitapçık
              </label>
              <select
                id="bookletId"
                name="bookletId"
                className="form-select"
                value={form.bookletId}
                onChange={handleFormChange}
              >
                <option value="">Seçiniz</option>
                {teoBooklets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {form.bookletId && (
                <p className="small text-muted mt-1">
                  {teoBooklets.find((b) => b.id === parseInt(form.bookletId))
                    ?.question_count ?? "Soru sayısı bilgisi yok"}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="difLevelId" className="form-label">
                Zorluk Seviyesi
              </label>
              <select
                id="difLevelId"
                name="difLevelId"
                className="form-select"
                value={form.difLevelId}
                onChange={handleFormChange}
              >
                <option value="">Seçiniz</option>
                {difLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          Güncelle
        </button>
      </div>
    </div>
  );
}
