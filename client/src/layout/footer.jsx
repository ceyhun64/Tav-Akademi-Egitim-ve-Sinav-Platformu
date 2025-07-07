import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo/logo.png";

export default function Footer() {
  const mainColor = "#001b66";
  const hoverColor = "#003399";

  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "50px 0 30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* Logo ve açıklama */}
          <div className="col-md-4 d-flex flex-column align-items-start">
            <img
              src={logo}
              alt="TAV Eğitim Platformu Logo"
              style={{
                width: "150px",
                marginBottom: "20px",
                objectFit: "contain",
              }}
            />
            <p
              style={{ color: "#4a5568", fontSize: "0.95rem", lineHeight: 1.6 }}
            >
              Profesyonel güvenlik eğitimleri, sınav hazırlıkları ve sertifika
              programları ile kariyerinizi güçlendirin. Modern içerik ve
              kapsamlı destekle başarıya ulaşın.
            </p>
          </div>

          {/* Hızlı erişim linkleri */}
          <div className="col-md-4">
            <h5
              className="fw-semibold mb-3"
              style={{ color: mainColor, fontWeight: 600 }}
            >
              Hızlı Erişim
            </h5>
            <ul
              className="list-unstyled"
              style={{ lineHeight: "2", fontSize: "0.95rem" }}
            >
              {[
                { to: "/courses", label: "Eğitimler" },
                { to: "/exams", label: "Sınavlar" },
                { to: "/about", label: "Hakkımızda" },
                { to: "/contact", label: "İletişim" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      color: mainColor,
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = hoverColor)}
                    onMouseLeave={(e) => (e.target.style.color = mainColor)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim & Sosyal medya */}
          <div className="col-md-4">
            <h5
              className="fw-semibold mb-3"
              style={{ color: mainColor, fontWeight: 600 }}
            >
              Bize Ulaşın
            </h5>
            <p
              style={{ color: "#4a5568", fontSize: "0.95rem", lineHeight: 1.6 }}
            >
              <i
                className="bi bi-telephone-fill me-2"
                style={{ color: mainColor }}
              ></i>
              +90 212 463 30 00
              <br />
              <i
                className="bi bi-envelope-fill me-2"
                style={{ color: mainColor }}
              ></i>
              destek@tavedu.com
            </p>

            <div className="d-flex gap-4 mt-3">
              {[
                { href: "https://facebook.com", icon: "facebook" },
                { href: "https://twitter.com", icon: "twitter" },
                { href: "https://instagram.com", icon: "instagram" },
                { href: "https://linkedin.com", icon: "linkedin" },
              ].map(({ href, icon }) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: mainColor,
                    fontSize: "1.7rem",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = hoverColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = mainColor)
                  }
                  aria-label={icon}
                >
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alt bilgi */}
      {/* Alt bilgi */}
      <div className="border-top mt-3 pt-3 d-flex justify-content-center">
        <div>
          <p
            className="mb-0"
            style={{
              fontSize: "0.85rem",
              color: "#6c757d",
              textAlign: "center",
            }}
          >
            © 2025 Tav Akademi Tüm Hakları Saklıdır. | Powered by{" "}
            <a
              href="https://bionluk.com/ceyhunturkmen"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#001b66",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Ceyhun Türkmen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
