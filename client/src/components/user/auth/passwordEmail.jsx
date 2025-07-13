import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAlert } from "../../../features/slices/authSlice";
import { passwordEmailThunk } from "../../../features/thunks/authThunk";

export default function PasswordEmail() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alert } = useSelector((state) => state.auth);

  const handlePasswordEmail = async (e) => {
    e.preventDefault();
    try {
      const action = await dispatch(passwordEmailThunk({ email })).unwrap();
      setTimeout(() => dispatch(clearAlert()), 1000);
    } catch (error) {
      setTimeout(() => dispatch(clearAlert()), 1000);
    }
  };

  const handleCancel = () => navigate("/login/user");

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        {alert.message && (
          <div
            className={`alert alert-${alert.type} py-1 text-center`}
            role="alert"
            style={{ fontSize: "0.9rem" }}
          >
            {alert.message}
          </div>
        )}
        <h3
          style={{
            fontWeight: "500",
            fontSize: "18px",
            textAlign: "left",
            borderBottom: "1px solid #ccc",
            paddingBottom: "8px",
            marginBottom: "20px",
          }}
        >
          Şifre Yenileme
        </h3>
        <form onSubmit={handlePasswordEmail}>
          <input
            id="email"
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: "38px", fontSize: "0.9rem" }}
            required
          />
          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-dark btn-sm px-3">
              Gönder
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={handleCancel}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
