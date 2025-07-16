import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createUnifiedExamThunk } from "../../../features/thunks/examThunk";
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

export default function UnifiedExamForm({ educationExam, onExamCreate }) {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.user);
  const [oranToplam, setOranToplam] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { questionCats, difLevels } = useSelector((state) => state.queDif);

  // Teorik ve Görüntü kitapçık listeleri için local state
  const [teoBooklets, setTeoBooklets] = useState([]);
  const [imgBooklets, setImgBooklets] = useState([]);
  const [selectedTeoBooklet, setSelectedTeoBooklet] = useState(null);
  const [selectedImgBooklet, setSelectedImgBooklet] = useState(null);

  // Form verisi
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    start_time_teo: "",
    end_time_teo: "",
    sure_teo: 0,
    start_time_img: "",
    end_time_img: "",
    sure_img: 0,
    attemp_limit: 1,
    passing_score: 0,
    mail: false,
    timed: false,
    sonucu_gizle: false,
    bookletId_teo: "",
    bookletId_img: "",
    method: "random",
    userIds: [],
    orana_gore_ata: false,
    zorluk_seviyesi: "karışık",
    toplam_soru: 0,
    ...Object.fromEntries(questionCats.map(({ id }) => [id, ""])),
  });
  useEffect(() => {
    dispatch(getQuestionCatThunk());
    dispatch(getDifLevelsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getBookletByTypeThunk("teo")).unwrap().then(setTeoBooklets);
    dispatch(getBookletByTypeThunk("img")).unwrap().then(setImgBooklets);
  }, [dispatch]);

  useEffect(() => {
    if (formData.bookletId_teo) {
      dispatch(getBookletByIdThunk(formData.bookletId_teo))
        .unwrap()
        .then(setSelectedTeoBooklet)
        .catch(() => setSelectedTeoBooklet(null));
    } else {
      setSelectedTeoBooklet(null);
    }
  }, [formData.bookletId_teo, dispatch]);
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

  useEffect(() => {
    if (formData.bookletId_img) {
      dispatch(getBookletByIdThunk(formData.bookletId_img))
        .unwrap()
        .then(setSelectedImgBooklet)
        .catch(() => setSelectedImgBooklet(null));
    } else {
      setSelectedImgBooklet(null);
    }
  }, [formData.bookletId_img, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserCheckbox = (userId) => {
    setFormData((prev) => {
      const ids = prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId];
      return { ...prev, userIds: ids };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // oran_gore_ata kontrolü ve alert
    if (formData.orana_gore_ata && oranToplam !== 100) {
      alert("Oranların toplamı 100 olmalıdır.");
      return; // Oranlar hatalıysa işlemi durdur
    }

    // category_percentages oluşturma
    const category_percentages = {};
    questionCats.forEach((cat) => {
      const id = cat.id.toString();
      if (formData[id] !== undefined && formData[id] !== "") {
        category_percentages[id] = Number(formData[id]);
      }
    });

    const payload = {
      ...formData,
      educationExam, // prop'tan gelen değer
      category_percentages, // Yeni eklenen oranlar
    };

    // formData'dan categoryId'ye karşılık gelen alanları temizleme
    questionCats.forEach((cat) => {
      const id = cat.id.toString();
      delete payload[id];
    });

    setIsSubmitting(true); // Gönderim başlarken

    try {
      const unifiedExam = await dispatch(
        createUnifiedExamThunk(payload) // Payload'ı güncellenmiş haliyle gönderiyoruz
      ).unwrap();

      alert("Sınav başarıyla oluşturuldu!");

      const { teoId, imgId } = unifiedExam.unified;

      if (onExamCreate) {
        onExamCreate({ teoId, imgId });
      }
    } catch (error) {
      alert("Hata oluştu: " + error.message);
      console.error("Birleşik sınav oluşturulurken hata:", error);
    } finally {
      setIsSubmitting(false); // Her durumda gizle
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
  const selectWidth = 300;
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
            className="mb-1 mt-2 ms-5"
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
            Karma Sınav Oluştur
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
        {isSubmitting && (
          <div className="loading-overlay">
            <div className="loading-modal">
              <p>İşlem Yapılıyor. Lütfen Bekleyiniz...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          {/* Form sections container */}
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
                marginBottom: "15px",
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-people-fill"
                style={{ marginRight: "8px" }}
              ></i>
              Sınav Bilgileri{" "}
            </h5>
            {/* Sınav Bilgileri */}
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Sınav İsmi
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  className="form-control"
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="start_date" className="form-label">
                    Başlangıç Tarihi
                  </label>
                  <input
                    id="start_date"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    autoComplete="off"
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="end_date" className="form-label">
                    Bitiş Tarihi
                  </label>
                  <input
                    id="end_date"
                    type="date"
                    name="end_date"
                    autoComplete="off"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="form-sections"
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              flexDirection: isMobile ? "column" : "row",
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
                Teorik Sınav Ayarları
              </h5>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <label htmlFor="start_time_teo" className="form-label">
                      Başlangıç Saati
                    </label>
                    <input
                      id="start_time_teo"
                      type="time"
                      name="start_time_teo"
                      autoComplete="off"
                      value={formData.start_time_teo}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="end_time_teo" className="form-label">
                      Bitiş Saati
                    </label>
                    <input
                      id="end_time_teo"
                      type="time"
                      name="end_time_teo"
                      autoComplete="off"
                      value={formData.end_time_teo}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="sure_teo" className="form-label">
                      Süre (dk)
                    </label>
                    <select
                      id="sure_teo"
                      name="sure_teo"
                      value={formData.sure_teo}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="0">Süresiz</option>

                      {Array.from({ length: 11 }, (_, i) => 5 + i).map(
                        (value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        )
                      )}
                      {Array.from({ length: 17 }, (_, i) => 20 + i * 5).map(
                        (value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="col-6">
                    <label htmlFor="bookletId_teo" className="form-label">
                      Teorik Kitapçık
                    </label>
                    <select
                      id="bookletId_teo"
                      name="bookletId_teo"
                      value={formData.bookletId_teo}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Kitapçık Seçiniz</option>
                      {teoBooklets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedTeoBooklet && (
                    <p className="col-12 mt-2">
                      Soru Sayısı: {selectedTeoBooklet.question_count}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/*right column*/}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
                border: "1px solid #e0e6ed",
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
                Uygulamalı Sınav Ayarları
              </h5>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <label htmlFor="start_time_img" className="form-label">
                      Başlangıç Saati
                    </label>
                    <input
                      id="start_time_img"
                      type="time"
                      name="start_time_img"
                      autoComplete="off"
                      value={formData.start_time_img}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="end_time_img" className="form-label">
                      Bitiş Saati
                    </label>
                    <input
                      id="end_time_img"
                      type="time"
                      name="end_time_img"
                      autoComplete="off"
                      value={formData.end_time_img}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="sure_img" className="form-label">
                      Soru Başına Süre (sn)
                    </label>
                    <select
                      id="sure_img"
                      name="sure_img"
                      value={formData.sure_img}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="0">Süresiz</option>

                      {Array.from({ length: 11 }, (_, i) => 5 + i).map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                      {Array.from({ length: 17 }, (_, i) => 20 + i * 5).map(
                        (v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="col-6">
                    <label htmlFor="bookletId_img" className="form-label">
                      Görüntü Kitapçık
                    </label>
                    <select
                      id="bookletId_img"
                      name="bookletId_img"
                      value={formData.bookletId_img}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Kitapçık Seçiniz</option>
                      {imgBooklets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedImgBooklet && (
                    <p className="col-12 mt-2">
                      Soru Sayısı: {selectedImgBooklet.question_count}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ortak Ayarlar */}
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
                marginBottom: "15px",
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-people-fill"
                style={{ marginRight: "8px" }}
              ></i>
              Ortak Ayarlar{" "}
            </h5>{" "}
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label htmlFor="attemp_limit" className="form-label">
                    Sınav Hakkı
                  </label>
                  <select
                    id="attemp_limit"
                    name="attemp_limit"
                    value={formData.attemp_limit}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                    {[...Array(9)].map((_, i) => {
                      const val = 20 + i * 10;
                      return (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label htmlFor="passing_score" className="form-label">
                    Geçme Notu
                  </label>
                  <select
                    id="passing_score"
                    name="passing_score"
                    value={formData.passing_score}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {Array.from({ length: 11 }, (_, i) => 50 + i * 5).map(
                      (v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label htmlFor="method" className="form-label">
                    Yöntem
                  </label>
                  <select
                    id="method"
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="random">Rastgele</option>
                    <option value="sequential">Sıralı</option>
                  </select>
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
                    onChange={handleChange}
                    id="orana_gore_ata"
                  />
                  <label htmlFor="orana_gore_ata" className="form-check-label">
                    Orana Göre Ata
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Oranlı Ayarlar */}
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
                    autoComplete="off"
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
                      autoComplete="off"
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
                onUserToggle={handleUserCheckbox}
                onToggleAll={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    userIds: checked ? users.map((u) => u.id) : [],
                  }))
                }
              />
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-4">
              Sınav Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
