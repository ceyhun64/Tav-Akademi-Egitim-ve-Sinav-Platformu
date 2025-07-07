import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutThunk } from "../../../features/thunks/authThunk";
import logo from "../../../../public/logo/logo.png";
import { clearAlert } from "../../../features/slices/authSlice";
import "./sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { ad } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  //kitapçık dropdownları için state ve ref
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
  const toggleRef = useRef(null);

  // Sınav dropdownları için state ve ref
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const examToggleRef = useRef(null);
  const [examDropdownPosition, setExamDropdownPosition] = useState({ top: 0 });

  // Eğitim dropdownları için state ve ref
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const educationToggleRef = useRef(null);
  const [educationDropdownPosition, setEducationDropdownPosition] = useState({
    top: 0,
  });

  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const reportToggleRef = useRef(null);
  const [reportDropdownPosition, setReportDropdownPosition] = useState({
    top: 0,
  });
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const settingsToggleRef = useRef(null);
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState({
    top: 0,
  });

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setTimeout(() => {
      dispatch(clearAlert());
      navigate("/");
    }, 1000);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleExamDropdown = () => setExamDropdownOpen((prev) => !prev);
  const toggleEducationDropdown = () =>
    setEducationDropdownOpen((prev) => !prev);
  const toggleReportDropdown = () => setReportDropdownOpen((prev) => !prev);
  const toggleSettingsDropdown = () => setSettingsDropdownOpen((prev) => !prev);

  useEffect(() => {
    if (dropdownOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.top });
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (examDropdownOpen && examToggleRef.current) {
      const rect = examToggleRef.current.getBoundingClientRect();
      setExamDropdownPosition({ top: rect.top });
    }
  }, [examDropdownOpen]);

  useEffect(() => {
    if (educationDropdownOpen && educationToggleRef.current) {
      const rect = educationToggleRef.current.getBoundingClientRect();
      setEducationDropdownPosition({ top: rect.top });
    }
  }, [educationDropdownOpen]);

  useEffect(() => {
    if (reportDropdownOpen && reportToggleRef.current) {
      const rect = reportToggleRef.current.getBoundingClientRect();
      setReportDropdownPosition({ top: rect.top });
    }
  }, [reportDropdownOpen]);

  useEffect(() => {
    if (settingsDropdownOpen && settingsToggleRef.current && menuRef.current) {
      const buttonRect = settingsToggleRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;

      setSettingsDropdownPosition({
        top:
          buttonRect.top - menuHeight + settingsToggleRef.current.offsetHeight,
        left: buttonRect.right + 8, // istersen sabit 285 de olur
      });
    }
  }, [settingsDropdownOpen]);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header d-flex align-items-center justify-content-center p-4">
          <Link
            to="/admin-panel"
            className="d-flex align-items-center text-decoration-none"
          >
            <img
              src={logo}
              alt="Tav Güvenlik Hizmetleri"
              style={{ height: "60px", marginRight: "12px" }}
            />
            <i className="bi bi-person-fill-gear"></i>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul className="list-unstyled m-0 p-0">
            <li>
              <Link
                to="/admin/register"
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/register" ? "active-link" : ""
                }`}
              >
                <i className="bi bi-people-fill me-2 fs-5"></i>{" "}
                {/* Kullanıcı İşlemleri için kullanıcı grubu */}
                Kullanıcı İşlemleri
              </Link>
            </li>

            <li>
              <Link
                to="/admin/authorized"
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/authorized" ? "active-link" : ""
                }`}
              >
                <i className="bi bi-shield-lock-fill me-2 fs-5"></i>{" "}
                {/* Yetkili İşlemleri için koruma/kilit */}
                Yetkili İşlemleri
              </Link>
            </li>

            <li>
              <button
                ref={toggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle ${
                  location.pathname.startsWith("/booklets") ? "active-link" : ""
                }`}
                onClick={toggleDropdown}
              >
                <span>
                  <i className="bi bi-journal-bookmark-fill me-2 fs-5"></i>{" "}
                  Kitapçıklar
                </span>
                <i
                  className={`bi ${
                    dropdownOpen ? "bi-caret-down-fill" : "bi-caret-right-fill"
                  }`}
                ></i>
              </button>
            </li>

            <li>
              <Link
                to="/admin/image-gallery"
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/image-gallery"
                    ? "active-link"
                    : ""
                }`}
              >
                <i className="bi bi-collection-fill me-2 fs-5"></i>{" "}
                {/* Kütüphane için koleksiyon */}
                Kütüphane
              </Link>
            </li>

            <li>
              <button
                ref={examToggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle ${
                  location.pathname.startsWith("/sinav-atamasi")
                    ? "active-link"
                    : ""
                }`}
                onClick={() => setExamDropdownOpen((prev) => !prev)}
              >
                <span>
                  <i className="bi bi-pencil-square me-2 fs-5"></i> Sınav
                  Ataması
                </span>
                <i
                  className={`bi ${
                    examDropdownOpen
                      ? "bi-caret-down-fill"
                      : "bi-caret-right-fill"
                  }`}
                ></i>
              </button>
            </li>

            {/* Eğitim Ataması dropdown */}
            <li>
              <button
                ref={educationToggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle ${
                  location.pathname.startsWith("/admin/education") ||
                  location.pathname.startsWith("/admin/education-set") ||
                  location.pathname.startsWith("/admin/assign-education-set")
                    ? "active-link"
                    : ""
                }`}
                onClick={toggleEducationDropdown}
              >
                <span>
                  <i className="bi bi-bookmark-plus-fill me-2 fs-5"></i> Eğitim
                  Ataması
                </span>
                <i
                  className={`bi ${
                    educationDropdownOpen
                      ? "bi-caret-down-fill"
                      : "bi-caret-right-fill"
                  }`}
                ></i>
              </button>
            </li>

            <li>
              <Link
                to="/admin/certificate"
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/certificate"
                    ? "active-link"
                    : ""
                }`}
              >
                <i className="bi bi-award-fill me-2 fs-5"></i>{" "}
                {/* Sertifika işlemleri için ödül */}
                Sertifika İşlemleri
              </Link>
            </li>

            <li>
              <button
                ref={reportToggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle ${
                  location.pathname.startsWith("/admin/img-exam-report") ||
                  location.pathname.startsWith("/admin/teo-exam-report") ||
                  location.pathname.startsWith("/admin/education-set-report")
                    ? "active-link"
                    : ""
                }`}
                onClick={toggleReportDropdown}
              >
                <span>
                  <i className="bi bi-clipboard-data me-2 fs-5"></i> Raporlar
                </span>
                <i
                  className={`bi ${
                    reportDropdownOpen
                      ? "bi-caret-down-fill"
                      : "bi-caret-right-fill"
                  }`}
                ></i>
              </button>
            </li>

            <li>
              <button
                ref={settingsToggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle ${
                  location.pathname.startsWith("/admin/education") ||
                  location.pathname.startsWith("/admin/education-set") ||
                  location.pathname.startsWith("/admin/assign-education-set")
                    ? "active-link"
                    : ""
                }`}
                onClick={toggleSettingsDropdown}
              >
                <span>
                  <i className="bi bi-gear me-2 fs-5"></i>
                  Ayarlar
                </span>
                <i
                  className={`bi ${
                    settingsDropdownOpen
                      ? "bi-caret-down-fill"
                      : "bi-caret-right-fill"
                  }`}
                ></i>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer p-3 mt-auto">
          <div className="welcome-text mb-3">
            Hoşgeldin,{" "}
            <strong style={{ color: "#001b66" }}>{ad || "Yönetici"}</strong>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontWeight: 600,
              borderRadius: "30px",
              padding: "8px 28px",
              marginLeft: "30px",
              border: "2px solid #dc3545",
              backgroundColor: "transparent",
              color: "#dc3545",
              boxShadow: "0 4px 6px rgba(220, 53, 69, 0.3)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontSize: "1rem",
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
              style={{ fontSize: "1.2rem" }}
            ></i>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {dropdownOpen && (
        <ul
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: dropdownPosition.top + "px",
            left: "285px", // Sidebar genişliği + boşluk
            width: "220px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            zIndex: 9999,
            padding: "0.5rem 0",
            margin: 0,
            listStyle: "none",
          }}
        >
          <li>
            <Link
              to="/admin/pool-teo"
              className={`sidebar-sublink ${
                location.pathname === "/admin/pool-teo" ? "active-link" : ""
              }`}
              onClick={() => setDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-book-half me-2"></i> Teorik Kitapçıklar
            </Link>
          </li>
          <li>
            <Link
              to="/admin/pool-img"
              className={`sidebar-sublink ${
                location.pathname === "/admin/pool-img" ? "active-link" : ""
              }`}
              onClick={() => setDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-image me-2"></i> Uygulama Kitapçıkları
            </Link>
          </li>
        </ul>
      )}
      {examDropdownOpen && (
        <ul
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: examDropdownPosition.top + "px",
            left: "285px", // Sidebar genişliği + boşluk
            width: "220px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            zIndex: 9999,
            padding: "0.5rem 0",
            margin: 0,
            listStyle: "none",
          }}
        >
          <li>
            <Link
              to="/admin/create-teo-exam"
              className={`sidebar-sublink ${
                location.pathname === "/sinav-atamasi/teorik"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setExamDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-file-earmark-text me-2"></i> Teorik Sınav
            </Link>
          </li>
          <li>
            <Link
              to="/admin/create-img-exam"
              className={`sidebar-sublink ${
                location.pathname === "/sinav-atamasi/uygulamali"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setExamDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-gear-fill me-2"></i> Uygulamalı Sınav
            </Link>
          </li>
          <li>
            <Link
              to="/admin/create-both-exam"
              className={`sidebar-sublink ${
                location.pathname === "/sinav-atamasi/karma"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setExamDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-ui-checks me-2"></i> Karma Sınav
            </Link>
          </li>
        </ul>
      )}
      {/* Eğitim Ataması Dropdown */}
      {educationDropdownOpen && (
        <ul
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: educationDropdownPosition.top + "px",
            left: "285px",
            width: "220px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            zIndex: 9999,
            padding: "0.5rem 0",
            margin: 0,
            listStyle: "none",
          }}
          onMouseLeave={() => setEducationDropdownOpen(false)}
          onMouseEnter={() => setEducationDropdownOpen(true)}
        >
          <li>
            <Link
              to="/admin/education"
              className={`sidebar-sublink ${
                location.pathname === "/admin/education" ? "active-link" : ""
              }`}
              onClick={() => setEducationDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-mortarboard-fill me-2"></i> Eğitimler
            </Link>
          </li>
          <li>
            <Link
              to="/admin/education-set"
              className={`sidebar-sublink ${
                location.pathname === "/admin/education-set"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setEducationDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-collection-fill me-2"></i> Eğitim Setleri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/assign-education-set"
              className={`sidebar-sublink ${
                location.pathname === "/admin/assign-education-set"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setEducationDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i class="bi bi-arrow-right-square-fill me-2"></i> Eğitim Seti Ata
            </Link>
          </li>
        </ul>
      )}
      {reportDropdownOpen && (
        <ul
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: reportDropdownPosition.top + "px",
            left: "285px",
            width: "220px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            zIndex: 9999,
            padding: "0.5rem 0",
            margin: 0,
            listStyle: "none",
          }}
        >
          <li>
            <Link
              to="/admin/img-exam-report"
              className={`sidebar-sublink ${
                location.pathname === "/admin/img-exam-report"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setReportDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-clipboard-check-fill me-2"></i> Uygulamalı
              Sınav Sonuçları
            </Link>
          </li>
          <li>
            <Link
              to="/admin/teo-exam-report"
              className={`sidebar-sublink ${
                location.pathname === "/admin/teo-exam-report"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setReportDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-file-earmark-text-fill me-2"></i> Teorik Sınav
              Sonuçları
            </Link>
          </li>
          <li>
            <Link
              to="/admin/education-set-report"
              className={`sidebar-sublink ${
                location.pathname === "/admin/education-set-report"
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setReportDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-journal-check me-2"></i> Eğitim Seti Sonuçları
            </Link>
          </li>
        </ul>
      )}
      {settingsDropdownOpen && (
        <ul
          ref={menuRef}
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: `${settingsDropdownPosition.top}px`,
            left: "285px",
            width: "220px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            zIndex: 9999,
            padding: "0.5rem 0",
            margin: 0,
            listStyle: "none",
          }}
        >
          <li>
            <Link
              to="/admin/ban-subs"
              className={`sidebar-sublink ${
                location.pathname === "/admin/ban-subs" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-slash-circle me-2"></i> Yasaklı Madde Listesi
            </Link>
          </li>
          <li>
            <Link
              to="/admin/que-dif"
              className={`sidebar-sublink ${
                location.pathname === "/admin/que-dif" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-images me-2"></i> Uygulamalı Soru Kategorileri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/practice-exam"
              className={`sidebar-sublink ${
                location.pathname === "/admin/practice-exam" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-clipboard-check me-2"></i> Pratik Sınav
              İşlemleri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/grp-inst"
              className={`sidebar-sublink ${
                location.pathname === "/admin/grp-inst" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-diagram-3 me-2"></i> Kurum ve Grup İşlemleri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/session"
              className={`sidebar-sublink ${
                location.pathname === "/admin/session" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-person-check me-2"></i> Aktif Kullanıcılar
            </Link>
          </li>
          <li>
            <Link
              to="/admin/announcement"
              className={`sidebar-sublink ${
                location.pathname === "/admin/announcement" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-megaphone me-2"></i> Duyuru İşlemleri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/upload-file"
              className={`sidebar-sublink ${
                location.pathname === "/admin/upload-file" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-upload me-2"></i> Dosya Yükleme İşlemleri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/role"
              className={`sidebar-sublink ${
                location.pathname === "/admin/role" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-shield-lock me-2"></i> Yetki İşlemleri
            </Link>
          </li>
          <li>
            <Link
              to="/admin/downloaded"
              className={`sidebar-sublink ${
                location.pathname === "/admin/downloaded" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-clock-history me-2"></i> Tebliğ Takip
            </Link>
          </li>
          <li>
            <Link
              to="/admin/log-activity"
              className={`sidebar-sublink ${
                location.pathname === "/admin/log-activity" ? "active-link" : ""
              }`}
              onClick={() => setSettingsDropdownOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                color: "#003399",
                fontWeight: 400,
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#001b66";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#003399";
              }}
            >
              <i className="bi bi-journal-check me-2"></i> İşlem Kayıtları
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
