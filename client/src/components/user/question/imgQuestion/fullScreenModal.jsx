import React from "react";

export default function FullscreenModal({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        cursor: "pointer",
        padding: "20px", // kenarlardan boşluk için
        overflow: "auto", // içerik büyükse kaydır
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: "8px",
          maxWidth: "160vw",
          maxHeight: "160vh",
          width: "auto",
          height: "auto",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          cursor: "default",
        }}
      >
        {/* Kapatma butonu */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "white",
            fontSize: 24,
            width: 40,
            height: 40,
            borderRadius: "50%",
            cursor: "pointer",
            lineHeight: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
          aria-label="Kapat"
          title="Kapat"
        >
          &times;
        </button>

        {/* İçerik alanı */}
        <div
          style={{
            padding: "20px",
            overflow: "auto",
            maxHeight: "85vh",
            maxWidth: "85vw",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
