import React from "react";

export default function UnauthorizedModal({ onClose }) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Daha koyu
          backdropFilter: "blur(8px)", // Daha fazla blur
          zIndex: 1000,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          zIndex: 1001,
          maxWidth: "90vw",
          textAlign: "center",
        }}
      >
        <p>Bu sayfaya erişme yetkiniz yoktur!</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Tamam
        </button>
      </div>
    </>
  );
}
