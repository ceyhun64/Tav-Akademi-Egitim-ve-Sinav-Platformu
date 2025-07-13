import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutThunk } from "../../../features/thunks/authThunk";
import { clearAlert } from "../../../features/slices/authSlice";
import "./navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { ad } = useSelector((state) => state.auth);

  const examsDropdownRef = useRef();
  const resultsDropdownRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'exams', 'results', or null

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setTimeout(() => {
      dispatch(clearAlert());
      navigate("/");
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        examsDropdownRef.current &&
        !examsDropdownRef.current.contains(event.target) &&
        resultsDropdownRef.current &&
        !resultsDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/user-panel"
        >
          <img
            src="/logo/logo.png"
            alt="Tav Güvenlik Hizmetleri"
            style={{ height: "80px", marginRight: "20px" }}
          />
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
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/education-set" ? "active-link" : ""
                }`}
                to="/education-set"
              >
                <i className="bi bi-mortarboard me-2"></i>
                Eğitimlerim
              </Link>
            </li>

            <li
              className="nav-item dropdown"
              ref={examsDropdownRef}
              style={{ position: "relative" }}
              onMouseEnter={() => setDropdownOpen("exams")}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <span
                className={`nav-link fw-medium custom-nav-link dropdown-toggle ${
                  location.pathname.startsWith("/teo-exams") ||
                  location.pathname.startsWith("/img-exams") ||
                  location.pathname.startsWith("/both-exams") ||
                  location.pathname.startsWith("/practice-exams")
                    ? "active-link"
                    : ""
                }`}
                role="button"
                onClick={() =>
                  setDropdownOpen(dropdownOpen === "exams" ? null : "exams")
                }
              >
                <i className="bi bi-journal-text me-2"></i>
                Sınavlarım
              </span>
              {dropdownOpen === "exams" && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 2px)", // Dropdown tam altında biraz boşluk ile
                    left: 0,
                    backgroundColor: "white",
                    borderRadius: "0.25rem",
                    padding: "0.5rem 0",
                    minWidth: "200px",
                    zIndex: 9999,
                    fontSize: "0.85rem", // Yazı boyutu küçültüldü
                    marginLeft: "30px",
                    border: "1px solid #ced4da",
                  }}
                >
                  <li>
                    <Link className="dropdown-item" to="/teo-exams">
                      Teorik Sınavlar
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/img-exams">
                      Görsel Sınavlar
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/both-exams">
                      Karma Sınavlar
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/practice-exams">
                      Pratik Sınavlar
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Sonuçlarım dropdown */}
            <li
              className="nav-item dropdown"
              ref={resultsDropdownRef}
              style={{ position: "relative" }}
              onMouseEnter={() => setDropdownOpen("results")}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <span
                className={`nav-link fw-medium custom-nav-link dropdown-toggle ${
                  location.pathname.startsWith("/teo-exam-report") ||
                  location.pathname.startsWith("/img-exam-report")
                    ? "active-link"
                    : ""
                }`}
                role="button"
                onClick={() =>
                  setDropdownOpen(dropdownOpen === "results" ? null : "results")
                }
              >
                <i className="bi bi-graph-up-arrow me-2"></i>
                Sonuçlarım
              </span>
              {dropdownOpen === "results" && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "white",
                    borderRadius: "0.25rem",
                    padding: "0.5rem 0",
                    minWidth: "200px",
                    zIndex: 9999,
                    marginLeft: "30px",
                  }}
                >
                  <li>
                    <Link className="dropdown-item" to="/teo-exam-report">
                      Teorik Sonuçlar
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/img-exam-report">
                      Görsel Sonuçlar
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/image-gallery" ? "active-link" : ""
                }`}
                to="/image-gallery"
              >
                <i className="bi bi-book me-2"></i>
                Kütüphane
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/downloads" ? "active-link" : ""
                }`}
                to="/downloads"
              >
                <i className="bi bi-download me-2"></i>
                İndirmeler
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/announcements" ? "active-link" : ""
                }`}
                to="/announcements"
              >
                <i className="bi bi-megaphone me-2"></i> {/* duyuru simgesi */}
                Duyurularım
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav align-items-center">
            <li className="nav-item d-flex align-items-center me-3">
              <span className="nav-link fw-semibold d-flex align-items-center gap-2">
                <i
                  className="bi bi-person"
                  style={{ color: "#001b66", fontSize: "1.25rem" }}
                ></i>
                <span style={{ color: "#001b66" }}>{ad || "Kullanıcı"}</span>
              </span>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                style={{
                  fontWeight: 600,
                  borderRadius: "30px",
                  padding: "8px 28px",
                  border: "2px solid #dc3545",
                  backgroundColor: "transparent",
                  color: "#dc3545",
                  boxShadow: "0 4px 6px rgba(220, 53, 69, 0.3)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.6rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc3545";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(220, 53, 69, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#dc3545";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px rgba(220, 53, 69, 0.3)";
                }}
              >
                <i
                  className="bi bi-box-arrow-right"
                  style={{ fontSize: "1rem" }}
                ></i>
                Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
