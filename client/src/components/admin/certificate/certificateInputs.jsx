import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCourseNosThunk,
  getCourseTypesThunk,
  getEducatorsThunk,
  getRequestersThunk,
  deleteCourseNoThunk,
  deleteCourseTypeThunk,
  deleteEducatorThunk,
  deleteRequesterThunk,
  createCourseNoThunk,
  createCourseTypeThunk,
  createEducatorThunk,
  createRequesterThunk,
} from "../../../features/thunks/certificateThunk";
import Sidebar from "../adminPanel/sidebar";

export default function CertificateInputs() {
  const dispatch = useDispatch();
  const { courseNos, courseTypes, educators, requesters } = useSelector(
    (store) => store.certificate
  );

  // Form input state'leri
  const [courseNo, setCourseNo] = useState("");
  const [courseType, setCourseType] = useState("");
  const [educator, setEducator] = useState("");
  const [requester, setRequester] = useState("");

  useEffect(() => {
    dispatch(getCourseNosThunk());
    dispatch(getCourseTypesThunk());
    dispatch(getEducatorsThunk());
    dispatch(getRequestersThunk());
  }, [dispatch]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const selectWidth = 300;
  return (
    <div
      className="poolImg-container"
      style={{ overflowX: "hidden", padding: "1rem" }}
    >
      {/* Sidebar */}
      <div
        style={{
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <h1
            className=" mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
            }}
          >
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: "1.6rem" }}
              ></i>
            )}
            Sertifika Seçeneklerini Düzenle
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "50px", // sağa itmek için
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>
        <div
          className="form-sections"
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "25px",
          }}
        >
          {/* Left Column */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
              border: "1px solid #e0e6ed",
            }}
          >
            <h5
              style={{
                color: "#001b66",
                marginBottom: "15px",
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-info-circle-fill"
                style={{ marginRight: "6px" }}
              ></i>
              Kurs No
            </h5>

            <ul
              style={{
                listStyle: "none",
                paddingLeft: 0,
                marginBottom: "1rem",
              }}
            >
              {courseNos.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>{item.name}</span>
                  <button
                    onClick={() => dispatch(deleteCourseNoThunk(item.id))}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                    }}
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
              <input
                value={courseNo}
                onChange={(e) => setCourseNo(e.target.value)}
                placeholder="Yeni Kurs No"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
              <button
                onClick={() => {
                  if (courseNo.trim()) {
                    dispatch(createCourseNoThunk({ name: courseNo }));
                    setCourseNo("");
                  }
                }}
                style={{
                  backgroundColor: "#003399",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Ekle
              </button>
            </div>
          </div>
          {/* Course Type */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
              border: "1px solid #e0e6ed",
            }}
          >
            <h5
              style={{
                color: "#001b66",
                marginBottom: "15px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="bi bi-info-circle-fill"></i> Kurs Tipi
            </h5>

            <ul
              style={{
                listStyle: "none",
                paddingLeft: 0,
                marginBottom: "1rem",
              }}
            >
              {courseTypes.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>{item.name}</span>
                  <button
                    onClick={() => dispatch(deleteCourseTypeThunk(item.id))}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                    }}
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
              <input
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                placeholder="Yeni Kurs Tipi"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
              <button
                onClick={() => {
                  if (courseType.trim()) {
                    dispatch(createCourseTypeThunk({ name: courseType }));
                    setCourseType("");
                  }
                }}
                style={{
                  backgroundColor: "#003399",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>

        <div
          className="form-sections"
          style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
        >
          {/* Educators */}
          {/* Left Column */}
          {/* Educators */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
              border: "1px solid #e0e6ed",
            }}
          >
            <h5
              style={{
                color: "#001b66",
                marginBottom: "15px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="bi bi-info-circle-fill"></i> Eğitmenler
            </h5>

            <ul
              style={{
                listStyle: "none",
                paddingLeft: 0,
                marginBottom: "1rem",
              }}
            >
              {educators.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>{item.name}</span>
                  <button
                    onClick={() => dispatch(deleteEducatorThunk(item.id))}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                    }}
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
              <input
                value={educator}
                onChange={(e) => setEducator(e.target.value)}
                placeholder="Yeni Eğitmen"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
              <button
                onClick={() => {
                  if (educator.trim()) {
                    dispatch(createEducatorThunk({ name: educator }));
                    setEducator("");
                  }
                }}
                style={{
                  backgroundColor: "#003399",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Left Column */}
          {/* Requesters */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
              border: "1px solid #e0e6ed",
            }}
          >
            <h5
              style={{
                color: "#001b66",
                marginBottom: "15px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="bi bi-info-circle-fill"></i> Talep Eden Yetkililer
            </h5>

            <ul
              style={{
                listStyle: "none",
                paddingLeft: 0,
                marginBottom: "1rem",
              }}
            >
              {requesters.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>{item.name}</span>
                  <button
                    onClick={() => dispatch(deleteRequesterThunk(item.id))}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                    }}
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
              <input
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                placeholder="Yeni Talep Eden Yetkili"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
              <button
                onClick={() => {
                  if (requester.trim()) {
                    dispatch(createRequesterThunk({ name: requester }));
                    setRequester("");
                  }
                }}
                style={{
                  backgroundColor: "#003399",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
