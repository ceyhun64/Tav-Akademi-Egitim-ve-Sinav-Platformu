import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createTeoExamThunk } from "../../../features/thunks/examThunk";
import { getAllUsersThunk } from "../../../features/thunks/userThunk";
import { Link } from "react-router-dom";
import {
  getBookletByTypeThunk,
  getBookletByIdThunk,
} from "../../../features/thunks/bookletThunk";
import { useNavigate } from "react-router-dom";
import UserList from "./userList";
import Sidebar from "../adminPanel/sidebar";

export default function CreateTeoExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, isLoading, error } = useSelector((state) => state.user);
  const { booklets } = useSelector((state) => state.booklet);

  const [selectedBooklet, setSelectedBooklet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    exam_type: "teo",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    sure: 5,
    attemp_limit: 1,
    passing_score: 50,
    mail: false,
    timed: false,
    sonucu_gizle: false,
    bookletId: "",
    method: "random",
    userIds: [],
  });

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getBookletByTypeThunk("teo"));
  }, [dispatch]);

  useEffect(() => {
    if (formData.bookletId) {
      dispatch(getBookletByIdThunk(formData.bookletId))
        .unwrap()
        .then(setSelectedBooklet)
        .catch(() => setSelectedBooklet(null));
    } else {
      setSelectedBooklet(null);
    }
  }, [formData.bookletId, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserCheckbox = (userId) => {
    setFormData((prev) => {
      const userIds = prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId];
      return { ...prev, userIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTeoExamThunk(formData))
      .unwrap()
      .then(() => {
        alert("Sınav başarıyla oluşturuldu!");
      })
      .catch((err) => {
        alert("Hata oluştu: " + err.message);
      });
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
            Teorik Sınav Oluştur
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
          {/* 2 Column Layout */}
          <div
            className="form-sections"
            style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
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
                Sınav Bilgileri
              </h5>

              {/* Name */}
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

              {/* Date/Time Inputs */}
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

              {/* Süre */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="sure" style={{ fontWeight: "500" }}>
                  Süre (dk)
                </label>
                <select
                  id="sure"
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
                  {Array.from({ length: 11 }, (_, i) => 5 + i).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                  {Array.from({ length: 17 }, (_, i) => 20 + i * 5).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>
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

              {/* Deneme Hakkı */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="attemp_limit" style={{ fontWeight: "500" }}>
                  Deneme Hakkı
                </label>
                <select
                  id="attemp_limit"
                  name="attemp_limit"
                  value={formData.attemp_limit}
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
                  {Array.from({ length: 10 }, (_, i) => i + 1)
                    .concat(Array.from({ length: 9 }, (_, i) => 20 + i * 10))
                    .map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </select>
              </div>

              {/* Geçme Notu */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="passing_score" style={{ fontWeight: "500" }}>
                  Geçme Notu
                </label>
                <select
                  id="passing_score"
                  name="passing_score"
                  value={formData.passing_score}
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
                  {Array.from({ length: 11 }, (_, i) => 50 + i * 5).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Kitapçık */}
              <div
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label
                  htmlFor="bookletId"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Kitapçık Seç
                </label>
                <select
                  id="bookletId"
                  name="bookletId"
                  value={formData.bookletId}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1.5px solid #001b66",
                    backgroundColor: "#f9fbfe",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0044cc")}
                  onBlur={(e) => (e.target.style.borderColor = "#001b66")}
                >
                  <option value="">Kitapçık Seçiniz</option>
                  {booklets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toplam Soru */}
              <div
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label
                  htmlFor="total_questions"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Toplam Soru
                </label>
                <input
                  id="total_questions"
                  type="number"
                  value={selectedBooklet ? selectedBooklet.question_count : ""}
                  readOnly
                  placeholder="Kitapçık seçiniz"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1.5px solid #ccc",
                    marginTop: "0",
                    backgroundColor: "#e9ecef",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#555",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              {/* Yöntem */}
              <div
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label
                  htmlFor="method"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Yöntem
                </label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1.5px solid #001b66",
                    backgroundColor: "#f9fbfe",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0044cc")}
                  onBlur={(e) => (e.target.style.borderColor = "#001b66")}
                >
                  <option value="random">Rastgele</option>
                  <option value="sequential">Sıralı</option>
                </select>
              </div>

              {/* Checkboxlar */}
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  marginTop: "20px",
                }}
              >
                {["mail", "timed", "sonucu_gizle"].map((key) => (
                  <label
                    key={key}
                    htmlFor={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#001b66",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={formData[key]}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        accentColor: "#001b66",
                      }}
                    />
                    {key === "mail" && "Mail Gönder"}
                    {key === "timed" && "Zamanlı"}
                    {key === "sonucu_gizle" && "Sonucu Gizle"}
                  </label>
                ))}
              </div>
            </div>
          </div>

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

          {/* Buton */}

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
