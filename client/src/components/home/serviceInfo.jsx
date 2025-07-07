import React from "react";

export default function PlatformFeatures() {
  return (
    <div
      style={{
        background: "linear-gradient(45deg, #f9fafb, rgba(29, 78, 216, 0.1))",
        padding: "50px 0",
        minHeight: "280px",
      }}
    >
      <div className="row text-center">
        {/* Sertifikalı Eğitimler */}
        <div className="col-md-3">
          <i
            className="bi bi-journal-bookmark"
            style={{ fontSize: "50px", color: "#1d4ed8", marginBottom: "15px" }}
          ></i>
          <h5 style={{ color: "#1d4ed8", fontWeight: "600" }}>
            Sertifikalı Eğitimler
          </h5>
          <p style={{ color: "#334155" }}>
            Endüstri standartlarında, profesyonel eğitim programları.
          </p>
        </div>

        {/* Gerçek Sınav Denemeleri */}
        <div className="col-md-3">
          <i
            className="bi bi-pencil-square"
            style={{ fontSize: "50px", color: "#1d4ed8", marginBottom: "15px" }}
          ></i>
          <h5 style={{ color: "#1d4ed8", fontWeight: "600" }}>
            Gerçek Sınav Denemeleri
          </h5>
          <p style={{ color: "#334155" }}>
            Gerçek sınav formatına uygun pratik denemeler.
          </p>
        </div>

        {/* Performans Takibi */}
        <div className="col-md-3">
          <i
            className="bi bi-bar-chart-line"
            style={{ fontSize: "50px", color: "#1d4ed8", marginBottom: "15px" }}
          ></i>
          <h5 style={{ color: "#1d4ed8", fontWeight: "600" }}>
            Detaylı Performans
          </h5>
          <p style={{ color: "#334155" }}>
            Kapsamlı analizler ve başarı takibiyle gelişimini izle.
          </p>
        </div>

        {/* 7/24 Destek */}
        <div className="col-md-3">
          <i
            className="bi bi-headset"
            style={{ fontSize: "50px", color: "#1d4ed8", marginBottom: "15px" }}
          ></i>
          <h5 style={{ color: "#1d4ed8", fontWeight: "600" }}>7/24 Destek</h5>
          <p style={{ color: "#334155" }}>
            Eğitim ve sınav süreçlerinde her zaman yanınızdayız.
          </p>
        </div>
      </div>
    </div>
  );
}
