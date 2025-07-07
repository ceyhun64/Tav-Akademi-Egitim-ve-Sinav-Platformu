import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setup2FAThunk } from "../../../features/thunks/authThunk";

export default function Setup2FA() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { qrCode } = useSelector((state) => state.auth);

  const userId = location.state?.userId;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/verify-2fa");
      return;
    }
    dispatch(setup2FAThunk(userId));
  }, [dispatch, userId, navigate]);

  useEffect(() => {
    if (qrCode) {
      setMessage(
        "Lütfen Google Authenticator uygulamanızı açın ve aşağıdaki QR kodu okutun."
      );
    }
  }, [qrCode]);

  const handleRetry = () => {
    if (userId) dispatch(setup2FAThunk(userId));
  };

  const handleGoToVerify = () => {
    navigate("/admin/verify-2fa", { state: { userId } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>İki Adımlı Doğrulama (2FA) Kurulumu</h1>

      {qrCode && (
        <>
          <p style={styles.message}>{message}</p>
          <img
            src={qrCode.qrCodeDataURL || qrCode}
            alt="2FA QR Kod"
            style={styles.qrCode}
          />
          <p style={styles.instructions}>
            QR kodu taradıktan sonra uygulama size 6 haneli bir doğrulama kodu
            verecektir. Bu kodu giriş ekranında kullanabilirsiniz.
          </p>
          <button onClick={handleRetry} style={styles.retryButton}>
            QR Kodunu Yeniden Getir
          </button>
          {/* İşte yeni eklenen buton */}
          <button onClick={handleGoToVerify} style={styles.verifyButton}>
            Doğrulama Kısmına Geç
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "2rem auto",
    padding: "1rem 2rem",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: "1px solid #ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  title: {
    marginBottom: "1rem",
    color: "#333",
  },
  retryButton: {
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: "0.5rem",
    marginRight: "0.5rem",
  },
  verifyButton: {
    backgroundColor: "#28a745",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  message: {
    marginBottom: "1rem",
    fontWeight: "500",
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: "1rem",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },
  instructions: {
    fontSize: 14,
    color: "#555",
    marginBottom: "1rem",
  },
};
