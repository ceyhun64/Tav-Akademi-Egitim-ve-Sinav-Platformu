import React from "react";
import Sidebar from "./sidebar";
import admin4 from "../../../../public/admin/admin4.png";

export default function AdminPanel() {
  return (
    <div
      className="container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden", // yatay kaymayı engeller
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1.5rem 1.2rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#003399", // biraz daha canlı mavi
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          maxWidth:"1000px",
          padding: "2.5rem 3rem",
          backgroundColor: "white",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          color: "white",
        }}
      >
        <img
          src={admin4}
          alt="Admin Panel"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "100%", // container dışına taşmasın
            objectFit: "cover", // gerekirse kırp
            borderRadius: "12px",
          }}
        />
      </div>
    </div>
  );
}
