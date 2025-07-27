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
      <div className="row text-center justify-content-center">
        {/* Özellik kutuları */}
        {[
          {
            icon: "bi-journal-bookmark",
            title: "Sertifikalı Eğitimler",
            desc: "Endüstri standartlarında, profesyonel eğitim programları.",
          },
          {
            icon: "bi-pencil-square",
            title: "Gerçek Sınav Denemeleri",
            desc: "Gerçek sınav formatına uygun pratik denemeler.",
          },
          {
            icon: "bi-bar-chart-line",
            title: "Detaylı Performans",
            desc: "Kapsamlı analizler ve başarı takibiyle gelişimini izle.",
          },
          {
            icon: "bi-headset",
            title: "7/24 Destek",
            desc: "Eğitim ve sınav süreçlerinde her zaman yanınızdayız.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="col-12 col-sm-6 col-md-3 d-flex flex-column align-items-center mb-4"
          >
            <i
              className={`bi ${item.icon}`}
              style={{
                fontSize: "50px",
                color: "#1d4ed8",
                marginBottom: "15px",
              }}
            ></i>
            <h5 style={{ color: "#1d4ed8", fontWeight: "600" }}>
              {item.title}
            </h5>
            <p
              className="text-center"
              style={{ color: "#334155", maxWidth: "250px" }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
