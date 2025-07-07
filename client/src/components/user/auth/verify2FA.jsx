import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verify2FAThunk } from "../../../features/thunks/authThunk";
import { clearAlert } from "../../../features/slices/authSlice";
import logo from "../../../../public/logo/logo.png";

export default function VerifyCode() {
  const [token, setToken] = useState("");
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

  const { alert, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userId) {
      navigate("/login/user");
      return;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [userId, navigate]);

  // Sadece sayısal 6 karakter alalım:
  const handleTokenChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,6}$/.test(val)) {
      setToken(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token.length !== 6) return; // 6 hane kontrolü

    // Backend'e userId ve token gönderiyoruz
    dispatch(verify2FAThunk({ userId, token }))
      .unwrap()
      .then(() => {
        // Başarılıysa yönlendirme
        navigate("/user-panel"); // veya istediğin sayfa
      })
      .catch(() => {
        // Hata alert için zaten redux state'den geliyor
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" style={{ height: 80 }} />
      </div>
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: 400, width: "100%", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#001b66" }}>
          Kod Doğrulama
        </h3>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="token"
            className="form-label fw-semibold"
            style={{ color: "#001b66" }}
          >
            Google Authenticator uygulamanızdaki 6 haneli kodu girin
          </label>
          <input
            ref={inputRef}
            id="token"
            type="text"
            className="form-control form-control-lg mb-4 text-center fs-4"
            value={token}
            onChange={handleTokenChange}
            maxLength={6}
            required
            inputMode="numeric"
            pattern="\d{6}"
            autoComplete="one-time-code"
            placeholder="______"
          />

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold"
            disabled={loading || token.length !== 6}
            style={{
              fontSize: "1.1rem",
              borderRadius: "10px",
              letterSpacing: "0.05em",
            }}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Doğrula ve Giriş Yap"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
