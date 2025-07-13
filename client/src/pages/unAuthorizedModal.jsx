import React from "react";

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        color: "#333",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "10rem", margin: 0, fontWeight: "bold" }}>401</h1>
      <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>Unauthorized</h2>
      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Bu sayfaya erişme yetkiniz yoktur.
      </p>
      <button
        onClick={() => window.history.back()}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        Geri Dön
      </button>
    </div>
  );
}
