import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserList from "../exam/userList";
import {
  getEducationSetsThunk,
  assignUsersToEducationSetThunk,
} from "../../../features/thunks/educationSetThunk";
import { getAllUsersThunk } from "../../../features/thunks/userThunk";
import Sidebar from "../adminPanel/sidebar";

export default function AssignEducationSet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { educationSets } = useSelector((state) => state.educationSet);
  const { users } = useSelector((state) => state.user); // örnek

  console.log(users);
  const [formData, setFormData] = useState({
    educationSetId: "",
    userIds: [],
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",

    mail: false,
  });

  useEffect(() => {
    dispatch(getEducationSetsThunk());
    dispatch(getAllUsersThunk()); // kullanıcıları getir
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userIds: formData.userIds.map((id) => Number(id)),
      educationSetId: Number(formData.educationSetId),
    };

    try {
      await dispatch(assignUsersToEducationSetThunk(payload)).unwrap();
      alert("Eğitim seti başarıyla atandı!");
    } catch (error) {
      alert("Atama sırasında bir hata oluştu.");
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
            className=" mt-2 ms-5"
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
            Eğitim Seti Ata
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
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 6px 15px rgba(0, 27, 102, 0.1)",
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
            Eğitim Seti Bilgileri
          </h5>
          <div className="mb-4">
            <label
              className="form-label"
              style={{ fontWeight: "700", color: "#001b66" }}
            >
              Eğitim Seti Seç *
            </label>
            <select
              name="educationSetId"
              value={formData.educationSetId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Seçiniz --</option>
              {educationSets?.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tarih ve Saatler */}
          <div
            className=" mb-4"
            style={{
              borderRadius: "12px",
            }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Eğitim Başlangıç Tarihi *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Bitiş Tarihi *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Başlangıç Saati *
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontWeight: "600", color: "#001b66" }}
                >
                  Bitiş Saati *
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
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
            <UserList
              isMobile={isMobile}
              users={users}
              selectedUserIds={formData.userIds}
              onUserToggle={(userId) =>
                setFormData((prev) => ({
                  ...prev,
                  userIds: prev.userIds.includes(userId)
                    ? prev.userIds.filter((id) => id !== userId)
                    : [...prev.userIds, userId],
                }))
              }
              onToggleAll={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  userIds: checked ? users.map((u) => u.id) : [],
                }))
              }
            />
          </div>

          <div
            className="form-check form-switch mt-3"
            style={{ color: "#001b66", fontWeight: "600" }}
          >
            <input
              type="checkbox"
              className="form-check-input"
              name="mail"
              checked={formData.mail}
              onChange={handleChange}
              id="mailSwitch"
            />
            <label className="form-check-label" htmlFor="mailSwitch">
              Kullanıcılara Mail Gönder
            </label>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#001b66",
                color: "#fff",
                width: "50%",
                fontWeight: "700",
                borderRadius: "8px",
                padding: "10px 0",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003080")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#001b66")
              }
            >
              Atamayı Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
