import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createImgExamThunk } from "../../../features/thunks/examThunk";
import { getAllUsersThunk } from "../../../features/thunks/userThunk";
import { Link } from "react-router-dom";

import {
  getBookletByTypeThunk,
  getBookletByIdThunk,
} from "../../../features/thunks/bookletThunk";
import UserList from "./userList";
import Sidebar from "../adminPanel/sidebar";
import {
  getQuestionCatThunk,
  getDifLevelsThunk,
} from "../../../features/thunks/queDifThunk";
import "./createImgExam.css";

export default function CreateImgExam({ onCreated }) {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.user);
  const { booklets, booklet } = useSelector((state) => state.booklet);
  const { questionCats, difLevels } = useSelector((state) => state.queDif);

  const [oranToplam, setOranToplam] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    exam_type: "teo",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    sure: "",
    attemp_limit: 1,
    passing_score: 0,
    mail: false,
    timed: false,
    sonucu_gizle: false,
    bookletId: "",
    method: "random",
    userIds: [],
    orana_gore_ata: false,
    zorluk_seviyesi: "",
    toplam_soru: "",
    ...Object.fromEntries(questionCats.map(({ id }) => [id, ""])),
  });

  useEffect(() => {
    dispatch(getQuestionCatThunk());
    dispatch(getDifLevelsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getBookletByTypeThunk("img"));
  }, [dispatch]);

  useEffect(() => {
    if (formData.bookletId) {
      dispatch(getBookletByIdThunk(formData.bookletId));
    }
  }, [dispatch, formData.bookletId]);

  useEffect(() => {
    if (formData.orana_gore_ata) {
      const toplam = questionCats.reduce(
        (sum, { id }) => sum + parseFloat(formData[id] || 0),
        0
      );
      setOranToplam(toplam);
    } else {
      setOranToplam(0);
    }
  }, [formData]);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleUserSelection = (userId) => {
    setFormData((prev) => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.orana_gore_ata && oranToplam !== 100) {
      alert("Oranların toplamı 100 olmalıdır.");
      return;
    }

    // questionCats dizisinden kategori id'lerini string olarak al
    const categoryIds = questionCats.map((cat) => cat.id.toString());

    // formData'dan kategori yüzdelerini topla
    const category_percentages = {};
    categoryIds.forEach((id) => {
      if (formData[id] !== undefined && formData[id] !== "") {
        category_percentages[id] = Number(formData[id]);
      }
    });

    // formData'yı kopyala ve category_percentages ekle
    const payload = {
      ...formData,
      category_percentages,
    };

    // Dilersen kategori key'lerini payload'dan silebilirsin, backend buna gerek duymuyorsa:
    categoryIds.forEach((id) => {
      delete payload[id];
    });

    try {
      const result = await dispatch(createImgExamThunk(payload)).unwrap();
      alert("Sınav başarıyla oluşturuldu!");
      onCreated?.(result.id);
    } catch (err) {
      alert("Sınav oluşturulamadı: " + err.message);
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
            Uygulamalı Sınav Oluştur
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

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          {/* Form sections container with two columns */}
          <div
            className="form-sections"
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Left Column */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
                border: "1px solid #e0e6ed",
                minWidth: "300px",
              }}
            >
              <h5
                style={{
                  color: "#001b66",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                <i
                  className="bi bi-info-circle-fill"
                  style={{ marginRight: "6px" }}
                ></i>
                Sınav Bilgileri
              </h5>

              {/* İsim */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="name" style={{ fontWeight: "500" }}>
                  İsim
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    marginTop: "5px",
                    backgroundColor: "#fff",
                    transition:
                      "border-color 0.2s ease-in-out, box-shadow 0.2s",
                  }}
                />
              </div>

              {/* Tarih ve Saat girişleri */}
              {[
                { label: "Başlangıç Tarihi", name: "start_date", type: "date" },
                { label: "Bitiş Tarihi", name: "end_date", type: "date" },
                { label: "Başlangıç Saati", name: "start_time", type: "time" },
                { label: "Bitiş Saati", name: "end_time", type: "time" },
              ].map(({ label, name, type }) => (
                <div key={name} style={{ marginBottom: "15px" }}>
                  <label htmlFor={name} style={{ fontWeight: "500" }}>
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      marginTop: "5px",
                      backgroundColor: "#fff",
                      transition:
                        "border-color 0.2s ease-in-out, box-shadow 0.2s",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
                border: "1px solid #e0e6ed",
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <h5
                style={{
                  color: "#001b66",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                <i
                  className="bi bi-gear-fill"
                  style={{ marginRight: "6px" }}
                ></i>
                Ayarlar
              </h5>
              {/* Süre (sn) */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="sure" style={{ fontWeight: "500" }}>
                  Süre (sn)
                </label>
                <select
                  id="sure"
                  className="custom-select"
                  name="sure"
                  value={formData.sure}
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
              {/* Deneme Hakkı */}
              <div>
                <label className="form-label">Deneme Hakkı</label>
                <select
                  name="attemp_limit"
                  value={formData.attemp_limit}
                  onChange={handleChange}
                  className="custom-select"
                >
                  {/* 1'den 10'a kadar 1'erli artış */}
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}

                  {/* 20'den 100'e kadar 10'ar artış */}
                  {Array.from({ length: 9 }, (_, i) => 20 + i * 10).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Geçme Notu */}
              <div>
                <label className="form-label">Geçme Notu</label>
                <select
                  name="passing_score"
                  value={formData.passing_score}
                  onChange={handleChange}
                  className="custom-select"
                >
                  {Array.from({ length: 11 }, (_, i) => 50 + i * 5).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Yöntem */}
              <div>
                <label className="form-label">Yöntem</label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  className="custom-select"
                >
                  <option value="random">Rastgele</option>
                  <option value="sequential">Sıralı</option>
                </select>
              </div>

              {/* Kitapçık */}
              <div>
                <label className="form-label">Kitapçık</label>
                <select
                  name="bookletId"
                  value={formData.bookletId}
                  onChange={handleChange}
                  required
                  className="custom-select"
                >
                  <option value="">Seçiniz</option>
                  {booklets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {booklet && (
                  <p className="small text-muted">
                    Toplam Soru: {booklet.question_count}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ek Ayarlar */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="mail"
                checked={formData.mail}
                onChange={handleChange}
                id="mail"
              />
              <label htmlFor="mail" className="form-check-label">
                Mail Gönder
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="timed"
                checked={formData.timed}
                onChange={handleChange}
                id="timed"
              />
              <label htmlFor="timed" className="form-check-label">
                Zamanlı
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="sonucu_gizle"
                checked={formData.sonucu_gizle}
                onChange={handleChange}
                id="sonucu_gizle"
              />
              <label htmlFor="sonucu_gizle" className="form-check-label">
                Sonucu Gizle
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="orana_gore_ata"
                checked={formData.orana_gore_ata}
                onChange={handleChange}
                id="orana_gore_ata"
              />
              <label htmlFor="orana_gore_ata" className="form-check-label">
                Orana Göre Ata
              </label>
            </div>
          </div>

          {/* Oranlı Ayarlar */}
          {formData.orana_gore_ata && (
            <div className="p-4 mt-4 border rounded shadow-sm bg-light">
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Zorluk Seviyesi
                  </label>
                  <select
                    name="zorluk_seviyesi"
                    value={formData.zorluk_seviyesi}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Seçiniz</option>
                    {difLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name} {/* Örneğin: Kolay, Orta, Zor */}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Toplam Soru</label>
                  <input
                    type="number"
                    name="toplam_soru"
                    value={formData.toplam_soru}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                  />
                </div>
              </div>

              <div className="row g-4 mt-3">
                {questionCats.map(({ id, name }) => (
                  <div key={id} className="col-md-4">
                    <label className="form-label fw-semibold">{name} (%)</label>
                    <input
                      type="number"
                      name={id.toString()} // id'yi string yapıyoruz
                      value={formData[id] || ""} // formData'dan id'ye göre alıyoruz
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <p className="mb-0">
                  <strong>Toplam Oran:</strong>{" "}
                  <span
                    className={`fw-bold ${
                      oranToplam !== 100 ? "text-danger" : "text-success"
                    }`}
                  >
                    {oranToplam.toFixed(2)}%
                  </span>
                  {oranToplam !== 100 && (
                    <span className="ms-2 text-danger">
                      (Toplam 100 olmalı!)
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Kullanıcılar */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 6px 15px rgba(0, 27, 102, 0.1)",
              marginTop: "30px",
            }}
          >
            <h5
              style={{
                color: "#001b66",
                marginBottom: "20px",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              <i
                className="bi bi-people-fill"
                style={{ marginRight: "8px" }}
              ></i>
              Kullanıcılar
            </h5>
            {isLoading ? (
              <p style={{ color: "#666" }}>Yükleniyor...</p>
            ) : error ? (
              <p style={{ color: "red", fontWeight: "600" }}>Hata: {error}</p>
            ) : (
              <UserList
                isMobile={isMobile}
                users={users}
                selectedUserIds={formData.userIds}
                onUserToggle={toggleUserSelection}
                onToggleAll={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    userIds: checked ? users.map((u) => u.id) : [],
                  }))
                }
              />
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            style={{
              fontSize: "16px",
              gridColumn: isMobile ? undefined : "1 / -1",
              justifySelf: "center", // Ortalamak için start yerine center
              width: isMobile ? "50%" : "150px", // Masaüstünde sabit, küçük genişlik
            }}
          >
            {" "}
            Sınav Oluştur
          </button>
        </form>
      </div>
    </div>
  );
}
