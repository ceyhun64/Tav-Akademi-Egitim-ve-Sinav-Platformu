import React, { useState } from "react";

export default function Topbar() {
  const [isVisible, setIsVisible] = useState(true);
  const closeTopbar = () => setIsVisible(false);

  const containerStyle = {
    backgroundColor: "#D3AF37",
    overflow: "hidden",
  };

  const trackWrapperStyle = {
    paddingRight: "50px", // Buton kadar boşluk bırakıyoruz
    position: "relative",
    overflow: "hidden",
  };

  const trackStyle = {
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "scrollLeft 40s linear infinite",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: "white",
  };

  const message =
    "Mağazaya ücretsiz teslimat • Ücretsiz iade • Bugün sepette ekstra %10 indirim • Yeni sezon ürünlerinde %20 fırsat • ";

  const closeButtonStyle = {
    fontSize: "1rem",
    cursor: "pointer",
    color: "white",
  };

  return (
    isVisible && (
      <>
        <div className="container-fluid py-2" style={containerStyle}>
          <div className="container">
            <div className="row align-items-center">
              {/* Yazı alanı */}
              <div className="col-11" style={trackWrapperStyle}>
                <div style={trackStyle}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i}>{message}</span>
                  ))}
                </div>
              </div>

              {/* Kapatma butonu */}
              <div className="col-1 text-end">
                <i
                  className="bi bi-x-lg"
                  style={closeButtonStyle}
                  onClick={closeTopbar}
                ></i>
              </div>
            </div>
          </div>
        </div>

        {/* Animasyon */}
        <style>
          {`
                        @keyframes scrollLeft {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                    `}
        </style>
      </>
    )
  );
}
