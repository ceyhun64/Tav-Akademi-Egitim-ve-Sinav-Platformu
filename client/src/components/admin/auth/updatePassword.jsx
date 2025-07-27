import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updatePasswordThunk } from "../../../features/thunks/authThunk";

// Şifre validasyonu fonksiyonu
const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [againNewPassword, setAgainNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== againNewPassword) {
      alert("Yeni şifre ile tekrar şifre aynı olmalıdır.");
      return;
    }

    if (!validatePassword(newPassword)) {
      alert(
        "Şifre en az 8 karakter olmalı, büyük harf, küçük harf, rakam ve özel karakter içermelidir."
      );
      return;
    }

    try {
      await dispatch(
        updatePasswordThunk({
          token,
          yenisifre: newPassword,
          tekraryenisifre: againNewPassword,
        })
      ).unwrap();

      alert("Şifreniz başarıyla güncellendi.");
      setTimeout(() => {
        navigate("/login/user");
      }, 1000);
    } catch (error) {
      alert("Şifre güncellenirken bir hata oluştu.");
      setTimeout(() => {
        navigate("/update-password");
      }, 1000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg">
            <h3 className="text-center fw-bold mb-4">Şifreyi Sıfırla</h3>

            <form onSubmit={handleUpdatePassword}>
              {/* Yeni Şifre */}
              {/* Yeni Şifre */}
              <div className="form-group mb-3 position-relative">
                <label htmlFor="newPassword" className="form-label">
                  Yeni Şifre
                </label>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="form-control pe-5"
                  placeholder="Yeni Şifre"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "72%",
                    right: "1rem",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  />
                </span>
              </div>

              {/* Yeni Şifre Tekrar */}
              <div className="form-group mb-3 position-relative">
                <label htmlFor="againNewPassword" className="form-label">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  id="againNewPassword"
                  type={showRepeatPassword ? "text" : "password"}
                  className="form-control pe-5"
                  placeholder="Yeni Şifre (Tekrar)"
                  value={againNewPassword}
                  onChange={(e) => setAgainNewPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "72%",
                    right: "1rem",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRepeatPassword((prev) => !prev)}
                >
                  <i
                    className={`bi ${
                      showRepeatPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  />
                </span>
              </div>

              <button type="submit" className="btn btn-dark w-100 mb-3">
                {loading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Şifreyi Güncelle"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
