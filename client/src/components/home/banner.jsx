import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import banner1 from "../../../public/banner/banner1.jpg";
import banner2 from "../../../public/banner/banner2.jpg";
import banner3 from "../../../public/banner/banner3.jpg";
import banner4 from "../../../public/banner/banner4.jpg";
import banner5 from "../../../public/banner/banner5.jpg";
import banner6 from "../../../public/banner/banner6.jpg";

export default function Banner() {
  return (
    <section className="hero-section container py-5">
      <div className="row align-items-center">
        {/* Sol Kısım: Metinler */}
        <div className="col-lg-6 mb-5 mb-lg-0">
          <h1 className="display-4 fw-bold mb-4">
            Tav Güvenlik <span className="text-primary">Eğitim</span> &{" "}
            <span className="text-primary">Sınav</span> Platformu
          </h1>

          <p className="lead text-muted mb-4">
            Sertifikalı eğitimlerimiz ve profesyonel sınav sistemimizle
            kariyerine sağlam bir temel at.
          </p>

          <ul className="list-unstyled mb-5 ps-2">
            <li className="mb-2">
              <i
                className="bi bi-check-circle-fill me-2"
                style={{ color: "#123879" }}
              ></i>
              Online ve yüz yüze eğitim seçenekleri
            </li>
            <li className="mb-2">
              <i
                className="bi bi-check-circle-fill me-2"
                style={{ color: "#123879" }}
              ></i>
              Gerçek sınav formatında deneme sınavları
            </li>
            <li className="mb-2">
              <i
                className="bi bi-check-circle-fill me-2"
                style={{ color: "#123879" }}
              ></i>
              Detaylı performans takibi ve analiz raporları
            </li>
            <li>
              <i
                className="bi bi-check-circle-fill me-2"
                style={{ color: "#123879" }}
              ></i>
              Resmi sertifika ve başarı belgeleri
            </li>
          </ul>

          <div className="d-flex gap-3 flex-wrap">
            <Link
              to="/courses"
              className="btn btn-primary btn-lg d-flex align-items-center gap-2 shadow-sm"
            >
              <i className="bi bi-mortarboard-fill" style={{color:"white"}}></i>
              Eğitimleri İncele
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline-custom btn-lg d-flex align-items-center gap-2 shadow-sm"
            >
              <i
                className="bi bi-telephone-fill"
                style={{ color: "#001b66" }}
              ></i>
              Bizimle İletişime Geçin
            </Link>
          </div>
        </div>

        {/* Sağ Kısım: Görsel Alan */}
        <div className="col-lg-6 text-center position-relative">
          <div className="position-relative d-inline-block hero-img-wrapper">
            <img
              src={banner2}
              alt="Eğitim Platformu"
              className="img-fluid rounded-4 shadow-lg hero-image"
            />

            {/* Mini Banner'lar - hover veya animasyonlu olabilir */}
            <img src={banner4} alt="" className="small-banner small-banner-1" />
            <img src={banner3} alt="" className="small-banner small-banner-2" />
            <img src={banner1} alt="" className="small-banner small-banner-3" />
            <img src={banner5} alt="" className="small-banner small-banner-4" />
            <img src={banner6} alt="" className="small-banner small-banner-5" />
          </div>
        </div>
      </div>
    </section>
    // aynen aynen siz takılın takılın sonra siz kötüsünüz aynen
    
  );
}
