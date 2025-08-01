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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      } else {
        setSidebarOpen(false); // küçük ekranda sidebar kapalı başlasın
      }
    };

    window.addEventListener("resize", handleResize);
    // İlk renderda da doğru durumu ayarla
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { ad } = useSelector((state) => state.auth);

  // Tüm sidebar için genel ref (hamburger menü ve ana sidebar içeriği için)
  const sidebarRef = useRef(null); // Yeni ekledik, menuref yerine bunu kullanacağız

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Kitapçık dropdownları için state ve ref
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
  const toggleRef = useRef(null); // Kitapçık butonu ref'i
  const dropdownMenuRef = useRef(null); // Kitapçık dropdown menüsü ref'i

  // Sınav dropdownları için state ve ref
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const examToggleRef = useRef(null); // Sınav butonu ref'i
  const [examDropdownPosition, setExamDropdownPosition] = useState({ top: 0 });
  const examDropdownMenuRef = useRef(null); // Sınav dropdown menüsü ref'i

  // Eğitim dropdownları için state ve ref
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const educationToggleRef = useRef(null); // Eğitim butonu ref'i
  const [educationDropdownPosition, setEducationDropdownPosition] = useState({
    top: 0,
  });
  const educationDropdownMenuRef = useRef(null); // Eğitim dropdown menüsü ref'i

  // Rapor dropdownları için state ve ref
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const reportToggleRef = useRef(null); // Rapor butonu ref'i
  const [reportDropdownPosition, setReportDropdownPosition] = useState({
    top: 0,
  });
  const reportDropdownMenuRef = useRef(null); // Rapor dropdown menüsü ref'i

  // Ayarlar dropdownları için state ve ref
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const settingsToggleRef = useRef(null); // Ayarlar butonu ref'i
  const [settingsDropdownPosition, setSettingsDropdownPosition] = useState({
    top: 0,
  });
  const settingsDropdownMenuRef = useRef(null); // Ayarlar dropdown menüsü ref'i

  // Ortak Kapatma Fonksiyonu
  const closeAllDropdowns = () => {
    setDropdownOpen(false);
    setExamDropdownOpen(false);
    setEducationDropdownOpen(false);
    setReportDropdownOpen(false);
    setSettingsDropdownOpen(false);
  };

  // Yeni handleClickOutside fonksiyonu
  useEffect(() => {
    function handleClickOutside(event) {
      // Tıklanan elementin bir Link (<a> etiketi) olup olmadığını kontrol et
      // Eğer bir Link'e tıklandıysa, bu tıklamayı dış tıklama olarak ele alma
      // ve linkin kendi navigasyonunu yapmasına izin ver.
      if (event.target.closest("a[href]")) {
        return;
      }

      // Sidebar'ın dışına tıklandıysa ve sidebar açıksa kapat
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarOpen &&
        window.innerWidth < 768 // Sadece mobil görünümde sidebar'ı dış tıklama ile kapat
      ) {
        setSidebarOpen(false);
        closeAllDropdowns();
        return; // Sidebar'ı kapattıysak, diğer dropdown kontrolüne geçmeyelim
      }

      // Herhangi bir dropdown butonu veya menüsüne tıklanmadıysa, tüm dropdownları kapat
      // Bu kısım, bir Link'e tıklandığında atlanacaktır
      if (
        (dropdownOpen &&
          toggleRef.current &&
          !toggleRef.current.contains(event.target) &&
          dropdownMenuRef.current &&
          !dropdownMenuRef.current.contains(event.target)) ||
        (examDropdownOpen &&
          examToggleRef.current &&
          !examToggleRef.current.contains(event.target) &&
          examDropdownMenuRef.current &&
          !examDropdownMenuRef.current.contains(event.target)) ||
        (educationDropdownOpen &&
          educationToggleRef.current &&
          !educationToggleRef.current.contains(event.target) &&
          educationDropdownMenuRef.current &&
          !educationDropdownMenuRef.current.contains(event.target)) ||
        (reportDropdownOpen &&
          reportToggleRef.current &&
          !reportToggleRef.current.contains(event.target) &&
          reportDropdownMenuRef.current &&
          !reportDropdownMenuRef.current.contains(event.target)) ||
        (settingsDropdownOpen &&
          settingsToggleRef.current &&
          !settingsToggleRef.current.contains(event.target) &&
          settingsDropdownMenuRef.current &&
          !settingsDropdownMenuRef.current.contains(event.target))
      ) {
        closeAllDropdowns();
      }
    }

    // Dropdownlardan herhangi biri açıksa veya sidebar açıksa event listener ekle
    // Sadece mousedown olayını dinlemeye devam ediyoruz.
    if (
      dropdownOpen ||
      examDropdownOpen ||
      educationDropdownOpen ||
      reportDropdownOpen ||
      settingsDropdownOpen ||
      sidebarOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    dropdownOpen,
    examDropdownOpen,
    educationDropdownOpen,
    reportDropdownOpen,
    settingsDropdownOpen,
    sidebarOpen,
    closeAllDropdowns, // closeAllDropdowns useCallback ile sarıldığı için bağımlılık olarak eklenmeli
    isMobile, // isMobile durumunu da bağımlılık olarak ekliyoruz
  ]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setTimeout(() => {
      dispatch(clearAlert());
      navigate("/");
    }, 1000);
  };

  // Her bir dropdown toggle fonksiyonunu güncelleyin
  const toggleDropdown = () => {
    if (dropdownOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns(); // Diğerlerini kapat
      setDropdownOpen(true); // Bunu aç
    }
  };

  const toggleExamDropdown = () => {
    if (examDropdownOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setExamDropdownOpen(true);
    }
  };

  const toggleEducationDropdown = () => {
    if (educationDropdownOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setEducationDropdownOpen(true);
    }
  };

  const toggleReportDropdown = () => {
    if (reportDropdownOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setReportDropdownOpen(true);
    }
  };

  const toggleSettingsDropdown = () => {
    if (settingsDropdownOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setSettingsDropdownOpen(true);
    }
  };

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

  // Menü açılıp kapanınca body'ye scroll engelleme
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Sidebar açıkken linke tıklayınca sidebar kapansın
  const handleLinkClick = (event) => {
    // `event` parametresini alın
    if (window.innerWidth <= 768) {
      // Mobil görünümde ise
      setSidebarOpen(false); // Sidebar'ı kapat
      closeAllDropdowns(); // Tüm dropdown'ları kapat
    }
    // Not: Link'in kendi varsayılan davranışını (yani `to` prop'una gitmeyi) engellemeyin.
    // React Router Link'i zaten doğru şekilde yönlendirecektir.
    // event.preventDefault() KULLANMAYIN!
  };

  useEffect(() => {
    if (
      settingsDropdownOpen &&
      settingsToggleRef.current &&
      sidebarRef.current
    ) {
      const buttonRect = settingsToggleRef.current.getBoundingClientRect();
      // Dropdown'ın sidebar içinde mi yoksa dışarıda mı konumlanacağına karar ver
      const sidebarWidth = sidebarRef.current.offsetWidth;
      const calculatedLeft = buttonRect.right + 8; // Sidebar'ın sağından biraz boşluk

      setSettingsDropdownPosition({
        top: buttonRect.top, // Butonun üst hizasında başlasın
        left: calculatedLeft,
      });
    }
  }, [settingsDropdownOpen, sidebarRef.current]);

  return (
    <>
      {/* Hamburger butonu */}
      <button
        className="hamburger-btn"
        aria-label="Toggle sidebar menu"
        onClick={toggleSidebar}
      >
        <div></div>
        <div></div>
        <div></div>
      </button>

      {/* Sidebar - sidebarRef'i buraya atadık */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-header d-flex align-items-center justify-content-center p-4">
          <Link
            to="/admin-panel"
            className="d-flex align-items-center text-decoration-none"
          >
            <img
              src={logo}
              onClick={handleLinkClick}
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
                onClick={handleLinkClick}
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/register" ? "active-link" : ""
                }`}
              >
                <i className="bi bi-people-fill me-2 fs-5"></i> Kullanıcı
                İşlemleri
              </Link>
            </li>

            <li>
              <button
                ref={toggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle `}
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
                onClick={handleLinkClick}
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/image-gallery"
                    ? "active-link"
                    : ""
                }`}
              >
                <i className="bi bi-collection-fill me-2 fs-5"></i> Kütüphane
              </Link>
            </li>

            <li>
              <button
                ref={examToggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle`}
                onClick={toggleExamDropdown}
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
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle `}
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
                onClick={handleLinkClick}
                className={`sidebar-link d-flex align-items-center ${
                  location.pathname === "/admin/certificate"
                    ? "active-link"
                    : ""
                }`}
              >
                <i className="bi bi-award-fill me-2 fs-5"></i> Sertifika
                İşlemleri
              </Link>
            </li>

            <li>
              <button
                ref={reportToggleRef}
                type="button"
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle `}
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
                className={`sidebar-link d-flex align-items-center justify-content-between w-100 btn btn-toggle `}
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
          <div className="welcome-text mb-1">
            Hoşgeldin,{" "}
            <strong style={{ color: "#001b66" }}>{ad || "Yönetici"}</strong>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontWeight: 600,
              borderRadius: "30px",
              padding: isMobile ? "4px 12px" : "8px 28px",
              border: "1px solid #660000ff",
              backgroundColor: "#ffffff",
              color: "#660000ff",
              cursor: "pointer",
              fontSize: isMobile ? "0.8rem" : "inherit",
              margin: isMobile ? "0.3rem auto 0.5rem auto" : "0 0 1rem 0",
              display: isMobile ? "block" : "inline-block",
              width: isMobile ? "fit-content" : "auto", // Buton genişliği içeriğe göre
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
        </div>
      </aside>

      {/* Her bir submenu-dropdown'a useRef atıyoruz */}
      {dropdownOpen && (
        <ul
          ref={dropdownMenuRef} // Yeni ref
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: dropdownPosition.top + "px",
            left: isMobile ? "160px" : "285px",
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
              onClick={handleLinkClick} // Linke tıklanınca da kapatma
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
              onClick={handleLinkClick} // Linke tıklanınca da kapatma
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
          ref={examDropdownMenuRef} // Yeni ref
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: examDropdownPosition.top + "px",
            left: isMobile ? "160px" : "285px",
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
          ref={educationDropdownMenuRef} // Yeni ref
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: educationDropdownPosition.top + "px",
            left: isMobile ? "160px" : "285px",
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
          // onMouseLeave ve onMouseEnter kaldırıldı, handleClickOutside yönetecek
        >
          <li>
            <Link
              to="/admin/education"
              className={`sidebar-sublink ${
                location.pathname === "/admin/education" ? "active-link" : ""
              }`}
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
              <i className="bi bi-arrow-right-square-fill me-2"></i> Eğitim Seti
              Ata
            </Link>
          </li>
        </ul>
      )}
      {reportDropdownOpen && (
        <ul
          ref={reportDropdownMenuRef} // Yeni ref
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: reportDropdownPosition.top + "px",
            left: isMobile ? "160px" : "285px",
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
          <li>
            <Link
              to="/admin/assign-teo-exams"
              className={`sidebar-sublink ${
                location.pathname === "/admin/assign-teo-exams"
                  ? "active-link"
                  : ""
              }`}
              onClick={handleLinkClick}
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
              <i className="bi bi-book me-2"></i>
              Atanmış Teorik Sınavlar
            </Link>
          </li>
          <li>
            <Link
              to="/admin/assign-img-exams"
              className={`sidebar-sublink ${
                location.pathname === "/admin/assign-img-exams"
                  ? "active-link"
                  : ""
              }`}
              onClick={handleLinkClick}
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
              <i className="bi bi-ui-checks-grid me-2"></i>
              Atanmış Uygulamalı Sınavlar
            </Link>
          </li>
          <li>
            <Link
              to="/admin/assign-education-sets"
              className={`sidebar-sublink ${
                location.pathname === "/admin/assign-education-sets"
                  ? "active-link"
                  : ""
              }`}
              onClick={handleLinkClick}
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
              <i className="bi bi-ui-checks-grid me-2"></i>
              Atanmış Eğitim Setleri
            </Link>
          </li>
        </ul>
      )}
      {settingsDropdownOpen && (
        <ul
          ref={settingsDropdownMenuRef}
          className="submenu-dropdown list-unstyled"
          style={{
            position: "fixed",
            top: `${settingsDropdownPosition.top - 400}px`, // 400 piksel yukarı kaydır
            left: isMobile ? "160px" : "285px",
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
                location.pathname === "/admin/practice-exam"
                  ? "active-link"
                  : ""
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
          <li>
            <Link
              to="/admin/illegal-moves"
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
              <i className="bi bi-slash-circle me-2"></i> İllegal Hareketler
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
