import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: "6rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem" }}>Sayfa bulunamadı</p>
      <Link
        to="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#000080", // lacivert
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
          marginTop: "20px",
        }}
      >
        Anasayfaya Dön
      </Link>
    </div>
  );
}
