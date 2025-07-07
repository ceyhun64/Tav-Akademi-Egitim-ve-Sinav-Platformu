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

    dispatch(createPoolTeoThunk(formData));
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

        <div className="content-columns">
          {/* Sol sütun */}
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
                onChange={handleFileChange}
              />
            </div>

            {previewURL && (
              <div className="mb-3">
                <img
                  src={previewURL}
                  alt="Seçilen görsel"
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

          {/* Sağ sütun */}
          <div className="right-column">
            {["a", "b", "c", "d", "e", "answer"].map((field) => (
              <div className="mb-3" key={field}>
                <label htmlFor={field} className="form-label">
                  {field.toUpperCase()}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === "answer" ? "Cevap" : ""}
                />
              </div>
            ))}

            <div className="mb-3">
              <label htmlFor="bookletId" className="form-label">
                Kitapçık
              </label>
              <select
                id="bookletId"
                name="bookletId"
                className="form-select"
                value={form.bookletId}
                onChange={handleChange}
              >
                <option value="">Seçiniz</option>
                {teoBooklets.map((booklet) => (
                  <option key={booklet.id} value={booklet.id}>
                    {booklet.name}
                  </option>
                ))}
              </select>
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
                onChange={handleChange}
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
          Kaydet
        </button>
      </div>
    </div>
  );
}
