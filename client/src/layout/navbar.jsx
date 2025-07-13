import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutThunk } from "../features/thunks/authThunk";
import logo from "../../public/logo/logo.png";
import "./navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { ad } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const handleLoginTypeSelect = (type) => {
    setDropdownOpen(false);
    if (type === "personel") {
      navigate("/login/user");
    } else if (type === "yonetici") {
      navigate("/login/admin");
    }
  };

  // Dropdown dışına tıklayınca kapanması için:
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Küçük helper: pencere genişliği kontrolü (mobil için hover değil click açma)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 1030,
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Tav Güvenlik Hizmetleri"
            style={{ height: "60px", marginRight: "20px" }}
          />
          <span
            className="fw-bold text-primary text-uppercase"
            style={{ letterSpacing: "0.1em" }}
          ></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav navbar-center mb-2 mb-lg-0">
            {["Anasayfa", "Hakkımızda", "İletişim"].map((item, idx) => {
              const paths = ["/", "/about", "/contact"];
              return (
                <li key={idx} className="nav-item">
                  <Link
                    className={`nav-link fw-medium custom-nav-link ${
                      location.pathname === paths[idx] ? "active-link" : ""
                    }`}
                    to={paths[idx]}
                  >
                    {item}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="navbar-nav align-items-center">
            {ad ? (
              <>
                <li className="nav-item d-flex align-items-center me-3">
                  <span className="nav-link text-primary fw-semibold">
                    Hoşgeldin, {ad}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary rounded-pill px-4"
                    onClick={handleLogout}
                    style={{ fontWeight: 600 }}
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            ) : (
              <li
                className="nav-item dropdown"
                ref={dropdownRef}
                onMouseEnter={() => !isMobile && setDropdownOpen(true)}
                onMouseLeave={() => !isMobile && setDropdownOpen(false)}
              >
                <button
                  className="btn btn-success dropdown-toggle rounded"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ width: "120px" }} // ← burası önemli!
                >
                  Giriş Yap
                </button>
                <ul
                  className={`dropdown-menu${dropdownOpen ? " show" : ""}`}
                  style={{ minWidth: "160px" }}
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleLoginTypeSelect("personel")}
                      style={{ width: "120px" }} // ← burası önemli!
                    >
                      Personel Girişi
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleLoginTypeSelect("yonetici")}
                      style={{ width: "120px" }} // ← burası önemli!
                    >
                      Yönetici Girişi
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
