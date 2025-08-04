import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSessionsThunk } from "../../../features/thunks/sessionThunk";
import Sidebar from "../adminPanel/sidebar";
import { getInstitutionsThunk } from "../../../features/thunks/grpInstThunk";

export default function Session() {
  const dispatch = useDispatch();
  const { sessions } = useSelector((state) => state.session);
  const { institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getSessionsThunk());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true); // büyük ekranlarda sidebar açık
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
            Aktif Kullanıcılar
          </h1>
        </div>
        <div
          className="table-responsive"
          style={{
            borderRadius: "16px",
            overflowY: "auto",
            overflowX: isTablet ? "hidden" : "auto",
            maxWidth: isMobile ? "700px" : isTablet ? "100%" : "1200px",
            maxHeight: isMobile ? "400px" : "800px",
            boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            padding: "12px",
          }}
        >
          <table
            className="table align-middle table-hover"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              minWidth: isMobile ? "350px" : isTablet ? "500px" : "1100px",
              userSelect: "none",
            }}
          >
            <thead
              style={{
                backgroundColor: "#e9f1ff",
                borderRadius: "12px",
              }}
            >
              <tr
                className="text-center align-middle"
                style={{ fontWeight: "600", color: "#334155" }}
              >
                <th style={{ width: "40px" }}>#</th>

                {/* Sadece masaüstü için Session ID */}
                {!isMobile && !isTablet && <th>Session ID</th>}

                <th>Ad</th>
                <th>Soyad</th>
                <th>Kullanıcı Adı</th>
                <th>Lokasyon</th>

                {!isMobile && !isTablet && (
                  <>
                    <th>Kullanıcı ID</th>
                    <th>Email</th>
                    <th>Oturum Durumu</th>
                    <th>Oluşturulma Tarihi</th>
                    <th>Güncellenme Tarihi</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {sessions && sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <tr
                    key={session.id}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                      borderRadius: "10px",
                      cursor: "default",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                  >
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {index + 1}
                    </td>

                    {/* Session ID sadece masaüstü */}
                    {!isMobile && !isTablet && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {session.sessionId}
                      </td>
                    )}

                    {/* Ortak alanlar */}
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {session.user?.ad || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {session.user?.soyad || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {session.user?.kullanici_adi || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {(() => {
                        const locId = session.user?.lokasyonId;
                        const institution = institutions.find(
                          (inst) => inst.id === locId
                        );
                        return institution ? institution.name : "-";
                      })()}
                    </td>

                    {/* Sadece masaüstü için kalan sütunlar */}
                    {!isMobile && !isTablet && (
                      <>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {session.userId}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {session.user?.email || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {session.isActive ? "Aktif" : "Pasif"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {new Date(session.createdAt).toLocaleString()}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {new Date(session.updatedAt).toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isMobile || isTablet ? 6 : 11}
                    className="text-center"
                  >
                    Aktif oturum bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
