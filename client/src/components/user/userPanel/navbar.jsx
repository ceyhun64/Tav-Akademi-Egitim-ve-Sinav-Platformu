import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutThunk } from "../../../features/thunks/authThunk";
import { clearAlert } from "../../../features/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { ad } = useSelector((state) => state.auth);

  const examsDropdownRef = useRef();
  const resultsDropdownRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'exams', 'results', or null
  const [collapseOpen, setCollapseOpen] = useState(false);

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

  const [isMobile, setIsMobile] = useState(false); // < 768px
  const [isTablet, setIsTablet] = useState(false); // 768px - 1400
  const TABLET_BREAKPOINT = 768;
  const DESKTOP_BREAKPOINT = 1300;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < TABLET_BREAKPOINT);
      setIsTablet(width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("mousedown", handleResize); // Changed from mousedown to resize
  }, []);

  // Dropdown açma kapama davranışını mobilde click, diğerlerinde hover ile ayarla
  const handleDropdownClick = (menu) => {
    if (isMobile) {
      setDropdownOpen((prev) => (prev === menu ? null : menu));
    }
  };

  const handleDropdownMouseEnter = (menu) => {
    if (!isMobile) {
      setDropdownOpen(menu);
    }
  };

  const handleDropdownMouseLeave = () => {
    if (!isMobile) {
      setDropdownOpen(null);
    }
  };

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

        {/* Hamburger Butonu React state ile kontrol */}
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={collapseOpen}
          aria-label="Toggle navigation"
          onClick={() => setCollapseOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse${collapseOpen ? " show" : ""}`}
          id="navbarNav"
        >
          <ul
            className="navbar-nav navbar-center mb-2 mb-lg-0"
            style={
              isTablet ? { flexWrap: "wrap", justifyContent: "center" } : {}
            }
          >
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/education-set" ? "active-link" : ""
                }`}
                to="/education-set"
                style={{
                  fontSize: isTablet || isMobile ? "0.8rem" : "0.9rem", // Smaller text for tablet/mobile
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "0.2rem", // Reduced padding
                  paddingRight: "0.2rem", // Reduced padding
                  display: "flex",
                  alignItems: "center",
                  gap: isTablet || isMobile ? "2px" : "6px", // Reduced gap
                  textAlign: "center",
                }}
              >
                {!(isTablet || isMobile) && ( // Icon hidden on tablet/mobile
                  <i
                    className="bi bi-mortarboard me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>
                )}
                Eğitimlerim
              </Link>
            </li>
            {/* Sınavlarım Dropdown */}
            <li
              className="nav-item dropdown"
              ref={examsDropdownRef}
              style={{ position: "relative" }}
              onMouseEnter={() => handleDropdownMouseEnter("exams")}
              onMouseLeave={() => handleDropdownMouseLeave()}
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
                onClick={() => handleDropdownClick("exams")}
                style={{
                  fontSize: isTablet || isMobile ? "0.8rem" : "0.9rem", // Smaller text
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "0.2rem", // Reduced padding
                  paddingRight: "0.2rem", // Reduced padding
                  display: "flex",
                  alignItems: "center",
                  gap: isTablet || isMobile ? "2px" : "6px", // Reduced gap
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {!(isTablet || isMobile) && ( // Icon hidden
                  <i
                    className="bi bi-journal-text me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>
                )}
                Sınavlarım
              </span>
              {(dropdownOpen === "exams" ||
                (!isMobile && dropdownOpen === "exams")) && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: isTablet || isMobile ? "0" : 0, // Align left for tablet/mobile
                    // transform: "none", // Remove transform to avoid centering
                    backgroundColor: "white",
                    borderRadius: "0.25rem",
                    padding: "0.5rem 0",
                    minWidth: "200px",
                    zIndex: 9999,
                    fontSize: "0.85rem",
                    marginLeft: isTablet || isMobile ? "0" : "30px", // Adjust margin for tablet/mobile
                    border: "1px solid #ced4da",
                  }}
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/teo-exams"
                      style={{ fontSize: "0.8rem", padding: "6px 15px" }}
                      onClick={() => setCollapseOpen(false)}
                    >
                      Teorik Sınavlar
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/img-exams"
                      style={{ fontSize: "0.8rem", padding: "6px 15px" }}
                      onClick={() => setCollapseOpen(false)}
                    >
                      Görsel Sınavlar
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/both-exams"
                      style={{ fontSize: "0.8rem", padding: "6px 15px" }}
                      onClick={() => setCollapseOpen(false)}
                    >
                      Karma Sınavlar
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/practice-exams"
                      style={{ fontSize: "0.8rem", padding: "6px 15px" }}
                      onClick={() => setCollapseOpen(false)}
                    >
                      Pratik Sınavlar
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Sonuçlarım Dropdown */}
            <li
              className="nav-item dropdown"
              ref={resultsDropdownRef}
              style={{ position: "relative" }}
              onMouseEnter={() => handleDropdownMouseEnter("results")}
              onMouseLeave={() => handleDropdownMouseLeave()}
            >
              <span
                className={`nav-link fw-medium custom-nav-link dropdown-toggle ${
                  location.pathname.startsWith("/teo-exam-report") ||
                  location.pathname.startsWith("/img-exam-report")
                    ? "active-link"
                    : ""
                }`}
                role="button"
                onClick={() => handleDropdownClick("results")}
                style={{
                  fontSize: isTablet || isMobile ? "0.8rem" : "0.9rem", // Smaller text
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "0.2rem", // Reduced padding
                  paddingRight: "0.2rem", // Reduced padding
                  display: "flex",
                  alignItems: "center",
                  gap: isTablet || isMobile ? "2px" : "6px", // Reduced gap
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {!(isTablet || isMobile) && ( // Icon hidden
                  <i
                    className="bi bi-graph-up-arrow me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>
                )}
                Sonuçlarım
              </span>
              {(dropdownOpen === "results" ||
                (!isMobile && dropdownOpen === "results")) && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: isTablet || isMobile ? "0" : 0, // Align left for tablet/mobile
                    // transform: "none", // Remove transform
                    backgroundColor: "white",
                    borderRadius: "0.25rem",
                    padding: "0.5rem 0",
                    minWidth: "200px",
                    zIndex: 9999,
                    marginLeft: isTablet || isMobile ? "0" : "30px", // Adjust margin for tablet/mobile
                  }}
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/teo-exam-report"
                      style={{ fontSize: "0.8rem", padding: "6px 15px" }}
                      onClick={() => setCollapseOpen(false)}
                    >
                      Teorik Sonuçlar
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/img-exam-report"
                      style={{ fontSize: "0.8rem", padding: "6px 15px" }}
                      onClick={() => setCollapseOpen(false)}
                    >
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
                style={{
                  fontSize: isTablet || isMobile ? "0.8rem" : "0.9rem", // Smaller text
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "0.2rem", // Reduced padding
                  paddingRight: "0.2rem", // Reduced padding
                  display: "flex",
                  alignItems: "center",
                  gap: isTablet || isMobile ? "2px" : "6px", // Reduced gap
                  textAlign: "center",
                }}
                onClick={() => setCollapseOpen(false)}
              >
                {!(isTablet || isMobile) && ( // Icon hidden
                  <i
                    className="bi bi-book me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>
                )}{" "}
                Kütüphane
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/downloads" ? "active-link" : ""
                }`}
                to="/downloads"
                style={{
                  fontSize: isTablet || isMobile ? "0.8rem" : "0.9rem", // Smaller text
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "0.2rem", // Reduced padding
                  paddingRight: "0.2rem", // Reduced padding
                  display: "flex",
                  alignItems: "center",
                  gap: isTablet || isMobile ? "2px" : "6px", // Reduced gap
                  textAlign: "center",
                }}
                onClick={() => setCollapseOpen(false)}
              >
                {!(isTablet || isMobile) && ( // Icon hidden
                  <i
                    className="bi bi-download me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>
                )}
                İndirmeler
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium custom-nav-link ${
                  location.pathname === "/announcements" ? "active-link" : ""
                }`}
                to="/announcements"
                style={{
                  fontSize: isTablet || isMobile ? "0.8rem" : "0.9rem", // Smaller text
                  paddingTop: "0.35rem",
                  paddingBottom: "0.35rem",
                  paddingLeft: "0.2rem", // Reduced padding
                  paddingRight: "0.2rem", // Reduced padding
                  display: "flex",
                  alignItems: "center",
                  gap: isTablet || isMobile ? "2px" : "6px", // Reduced gap
                  textAlign: "center",
                }}
                onClick={() => setCollapseOpen(false)}
              >
                {!(isTablet || isMobile) && ( // Icon hidden
                  <i
                    className="bi bi-megaphone me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>
                )}{" "}
                Duyurularım
              </Link>
            </li>
          </ul>

          <ul
            className="navbar-nav align-items-center"
            style={
              isTablet
                ? {
                    marginLeft: "auto",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    marginTop: "1rem",
                  }
                : {}
            }
          >
            <li className="nav-item">
              <button
                onClick={handleLogout}
                style={{
                  fontWeight: 600,
                  borderRadius: "30px",
                  padding: isTablet || isMobile ? "4px 12px" : "8px 28px",
                  border: "1px solid #660000ff",
                  backgroundColor: "#ffffff",
                  color: "#660000ff",
                  cursor: "pointer",
                  fontSize: isTablet || isMobile ? "0.8rem" : "inherit",
                  margin: isTablet || isMobile ? "-0.3rem 0 0 0" : "0",
                  display: isTablet || isMobile ? "block" : "inline-block",
                  marginTop: isTablet || isMobile ? "0.0rem" : "0.5rem",
                  marginBottom: isTablet || isMobile ? "0.5rem" : "0",

                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#b71717ff";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#b91a1aff";
                }}
              >
                Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
