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
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Kapatma butonu */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
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
          }}
          aria-label="Kapat"
          title="Kapat"
        >
          &times;
        </button>

        {/* İçerik tam ekran */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
