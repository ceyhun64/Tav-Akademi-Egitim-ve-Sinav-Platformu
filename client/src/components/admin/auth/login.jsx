import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  adminLoginThunk,
  loginThunk,
} from "../../../features/thunks/authThunk";
import { clearAlert } from "../../../features/slices/authSlice";
import logo from "../../../../public/logo/logo.png";
import login2 from "../../../../public/login/login2.jpg";

export default function AdminLogin() {
  const [kullanici_adi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreGoster, setSifreGoster] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alert, is2FAEnabled, userId } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        adminLoginThunk({ kullanici_adi, sifre })
      ).unwrap();
      console.log(response);
      if (response.is2FAEnabled !== true) {
        navigate("/admin/setup-2fa", { state: { userId: response.userId } });
      } else
        navigate("/admin/verify-2fa", { state: { userId: response.userId } });
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => dispatch(clearAlert()), 3000);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{
        padding: "2rem",
        height: "89vh", // Sabit yükseklik verdik
        overflowY: "auto", // Gerektiğinde dikey scroll
      }}
    >
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-center bg-white rounded-4 shadow-lg"
        style={{ maxWidth: "900px", width: "100%", overflow: "hidden" }}
      >
        {/* Form alanı */}
        <div
          className="p-4"
          style={{
            flex: "1 1 0",
            minWidth: 0,
            maxWidth: "360px",
          }}
        >
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "160px", maxWidth: "100%", height: "auto" }}
              className="mb-3"
            />
            <h2 className="fw-bold" style={{ color: "#001b66" }}>
              Yönetici Girişi
            </h2>
          </div>

          {alert?.message && (
            <div
              className={`alert alert-${alert?.type} text-center`}
              role="alert"
              style={{ fontSize: "0.9rem" }}
            >
              {alert?.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="kullanici_adi" className="form-label fw-semibold">
                Kullanıcı Adı
              </label>
              <input
                id="kullanici_adi"
                type="text"
                className="form-control rounded-3 shadow-sm"
                placeholder="Kullanıcı Adınızı girin"
                value={kullanici_adi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                required
                style={{ height: "40px", fontSize: "0.95rem" }}
              />
            </div>

            <div className="form-group mb-4 position-relative">
              <label htmlFor="sifre" className="form-label fw-semibold">
                Şifre
              </label>
              <input
                id="sifre"
                type={sifreGoster ? "text" : "password"}
                className="form-control rounded-3 shadow-sm pe-5"
                placeholder="Şifrenizi girin"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                required
                style={{
                  height: "40px",
                  fontSize: "0.95rem",
                  paddingRight: "3rem",
                }}
              />
              <button
                type="button"
                onClick={() => setSifreGoster(!sifreGoster)}
                className="position-absolute"
                style={{
                  top: "73%",
                  right: "1rem",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.4rem",
                  color: "#6c757d",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                  userSelect: "none",
                }}
                tabIndex={-1}
                aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                <i
                  className={`bi ${sifreGoster ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>

            <div className="text-end mb-4">
              <Link
                to="/password-email"
                className="text-decoration-none small text-secondary"
                style={{ fontWeight: "500" }}
              >
                Şifremi Unuttum?
              </Link>
            </div>

            <button
              type="submit"
              className="w-100 rounded-3 fw-semibold text-white border-0"
              style={{
                backgroundColor: "#001b66",
                fontSize: "0.9rem",
                transition: "background-color 0.3s ease",
                height: "40px",
                padding: "0 1rem",
              }}
            >
              Giriş Yap
            </button>
          </form>
        </div>

        {/* Sağdaki görsel */}
        <div
          className="d-none d-md-block flex-shrink-0"
          style={{
            width: "450px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={login2}
            alt="Login Visual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderTopRightRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
          />
        </div>
      </div>
    </div>
  );
}
