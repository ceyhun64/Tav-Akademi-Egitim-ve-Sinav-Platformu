import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../../features/thunks/authThunk";
import { clearAlert } from "../../../features/slices/authSlice";
import logo from "../../../../public/logo/logo.png";
import login1 from "../../../../public/login/login1.png";
import { useEffect } from "react";

export default function Login() {
  const [kullanici_adi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreGoster, setSifreGoster] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alert, loading, is2FAEnabled } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        loginThunk({ kullanici_adi, sifre })
      ).unwrap();

      if (response && response.userId) {
        if (response.is2FAEnabled === false) {
          // 2FA etkin değilse setup sayfasına yönlendir
          navigate("/setup-2fa", { state: { userId: response.userId } });
        } else {
          // 2FA aktifse doğrulama kodu ekranına yönlendir
          navigate("/verify-2fa", { state: { userId: response.userId } });
        }
      } else {
        navigate("/");
      }
      dispatch(clearAlert());
    } catch (error) {
      console.error("Giriş hatası:", error);
      setTimeout(() => {
        dispatch(clearAlert());
      }, 2000);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      style={{ padding: "2rem" }}
    >
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-center bg-white rounded-4 shadow-lg"
        style={{ maxWidth: "900px", width: "100%", overflow: "hidden" }}
      >
        {/* Form alanı */}
        <div
          className="p-5"
          style={{
            flex: "1 1 0",
            minWidth: 0,
            maxWidth: "450px",
          }}
        >
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" width="110" className="mb-3" />
            <h2 className="fw-bold" style={{ color: "#001b66" }}>
              Kullanıcı Girişi
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
                style={{ height: "45px", fontSize: "1rem" }}
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
                  height: "45px",
                  fontSize: "1rem",
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
              className="w-100 py-3 rounded-3 fw-semibold text-white border-0"
              style={{
                backgroundColor: "#001b66",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
                fontSize: "1.1rem",
                transition: "background-color 0.3s ease",
              }}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#0042a6";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#001b66";
              }}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Giriş Yap"
              )}
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
            src={login1}
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
