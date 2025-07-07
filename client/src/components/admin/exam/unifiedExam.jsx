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

export default function UnifiedExamForm({ educationExam, onExamCreate }) {
  const ORAN_FIELDS = [
    { name: "temiz_bagaj_oran", label: "Temiz Bagaj" },
    { name: "tanimsiz_bagaj_oran", label: "Tanımsız Bagaj" },
    { name: "patlayicilar_oran", label: "Patlayıcılar" },
    { name: "atesli_silahlar_oran", label: "Ateşli Silahlar" },
    { name: "kesici_aletler_oran", label: "Kesici Aletler" },
    { name: "tehlikeli_maddeler_oran", label: "Tehlikeli Maddeler" },
  ];
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.user);
  const [oranToplam, setOranToplam] = useState(0);

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
    ...Object.fromEntries(ORAN_FIELDS.map(({ name }) => [name, ""])),
  });

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
      const toplam = ORAN_FIELDS.reduce(
        (sum, { name }) => sum + parseFloat(formData[name] || 0),
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

  useEffect(() => {
    if (formData.orana_gore_ata) {
      const {
        temiz_bagaj_oran,
        tanimsiz_bagaj_oran,
        patlayicilar_oran,
        atesli_silahlar_oran,
        kesici_aletler_oran,
        tehlikeli_maddeler_oran,
      } = formData;

      const toplam =
        parseFloat(temiz_bagaj_oran || 0) +
        parseFloat(tanimsiz_bagaj_oran || 0) +
        parseFloat(patlayicilar_oran || 0) +
        parseFloat(atesli_silahlar_oran || 0) +
        parseFloat(kesici_aletler_oran || 0) +
        parseFloat(tehlikeli_maddeler_oran || 0);

      setOranToplam(toplam);
    }
  }, [formData]);

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
    const dataToSend = {
      ...formData,
      educationExam, // prop'tan gelen değer
    };

    try {
      const unifiedExam = await dispatch(
        createUnifiedExamThunk(dataToSend)
      ).unwrap();

      // API'den gelen teoId ve imgId
      const { teoId, imgId } = unifiedExam.unified;

      // Üst component'e gönder
      if (onExamCreate) {
        onExamCreate({ teoId, imgId });
      }
    } catch (error) {
      console.error("Birleşik sınav oluşturulurken hata:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav
          className="col-md-3 col-lg-2 d-md-block bg-primary text-white sidebar collapse vh-100 position-fixed"
          style={{
            padding: "1rem",
            overflowY: "auto",
            top: 0,
            left: 0,
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
            zIndex: 10,
          }}
        >
          <Sidebar />
        </nav>

        {/* Main Content */}
        <main
          className="col-md-9 ms-sm-auto col-lg-10 px-md-4"
          style={{
            marginLeft: "auto",
            backgroundColor: "#f8f9fc",
            minHeight: "100vh",
            paddingTop: "2rem",
            paddingBottom: "2rem",
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
            <h1
              style={{
                color: "#001b66",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              <i className="bi bi-ui-checks" style={{ marginRight: "8px" }}></i>
              Karma Sınav Oluştur
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="p-3">
            {/* Form sections container */}
            <div className="row g-4">
              {/* Sınav Bilgileri */}
              <div className="card shadow-sm border rounded-3">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    <i className="bi bi-info-circle-fill me-2"></i>Sınav
                    Bilgileri
                  </h5>

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Sınav İsmi
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                        value={formData.end_date}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-4">
                {/* İkinci sütun */}
                <div className="col-lg-6">
                  {/* Teorik Sınav */}
                  <div className="card shadow-sm border rounded-3 mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-3">
                        <i className="bi bi-file-text-fill me-2"></i>
                        Teorik Sınav
                      </h5>

                      <div className="row g-3">
                        <div className="col-4">
                          <label
                            htmlFor="start_time_teo"
                            className="form-label"
                          >
                            Başlangıç Saati
                          </label>
                          <input
                            id="start_time_teo"
                            type="time"
                            name="start_time_teo"
                            value={formData.start_time_teo}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-4">
                          <label htmlFor="end_time_teo" className="form-label">
                            Bitiş Saati
                          </label>
                          <input
                            id="end_time_teo"
                            type="time"
                            name="end_time_teo"
                            value={formData.end_time_teo}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        {/* Süre */}
                        <div className="col-4">
                          <label htmlFor="sure" className="form-label">
                            Süre (dk)
                          </label>
                          <select
                            id="sure"
                            name="sure"
                            value={formData.sure}
                            onChange={handleChange}
                            className="form-select"
                          >
                            {Array.from({ length: 11 }, (_, i) => 5 + i).map(
                              (value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              )
                            )}
                            {Array.from(
                              { length: 17 },
                              (_, i) => 20 + i * 5
                            ).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12">
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
                </div>
                <div className="col-lg-6">
                  {/* Uygulamalı Sınav */}
                  <div className="card shadow-sm border rounded-3 mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-3">
                        <i className="bi bi-image me-2"></i>
                        Uygulamalı Sınav
                      </h5>

                      <div className="row g-3">
                        <div className="col-4">
                          <label
                            htmlFor="start_time_img"
                            className="form-label"
                          >
                            Başlangıç Saati
                          </label>
                          <input
                            id="start_time_img"
                            type="time"
                            name="start_time_img"
                            value={formData.start_time_img}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-4">
                          <label htmlFor="end_time_img" className="form-label">
                            Bitiş Saati
                          </label>
                          <input
                            id="end_time_img"
                            type="time"
                            name="end_time_img"
                            value={formData.end_time_img}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-4">
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
                            {Array.from({ length: 11 }, (_, i) => 5 + i).map(
                              (v) => (
                                <option key={v} value={v}>
                                  {v}
                                </option>
                              )
                            )}
                            {Array.from(
                              { length: 17 },
                              (_, i) => 20 + i * 5
                            ).map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12">
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
              </div>

              {/* Ortak Ayarlar */}
              <div className="card shadow-sm border rounded-3 mt-4">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    Ortak Ayarlar
                  </h5>
                  <div className="row g-3">
                    <div className="col-4">
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
                    <div className="col-4">
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
                    <div className="col-4">
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
                      <label
                        htmlFor="sonucu_gizle"
                        className="form-check-label"
                      >
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
                      <label
                        htmlFor="orana_gore_ata"
                        className="form-check-label"
                      >
                        Orana Göre Ata
                      </label>
                    </div>
                  </div>
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
                        <option value="kolay">Kolay</option>
                        <option value="orta">Orta</option>
                        <option value="zor">Zor</option>
                        <option value="karışık">Karışık</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Toplam Soru
                      </label>
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
                    {ORAN_FIELDS.map(({ name, label }) => (
                      <div key={name} className="col-md-4">
                        <label className="form-label fw-semibold">
                          {label} (%)
                        </label>
                        <input
                          type="number"
                          name={name}
                          value={formData[name]}
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
                  <p style={{ color: "red", fontWeight: "600" }}>
                    Hata: {error}
                  </p>
                ) : (
                  <UserList
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
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
