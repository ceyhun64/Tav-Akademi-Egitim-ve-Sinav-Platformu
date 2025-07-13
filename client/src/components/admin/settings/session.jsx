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
            Aktif Kullanıcılar
          </h1>
        </div>
        <div
          className="table-responsive"
          style={{
            borderRadius: "16px",
            overflow: "auto",
            maxWidth: isMobile ? "350px" : "1200px", // mobilde daha dar yap
            maxHeight: isMobile ? "400px" : "800px", // mobilde daha kısa yap
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
              minWidth: isMobile ? "350px" : "1100px", // mobilde daha dar
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
                <th>Session ID</th>
                {isMobile ? (
                  <>
                    <th>Ad</th>
                    <th>Soyad</th>
                  </>
                ) : (
                  <>
                    <th>Ad</th>
                    <th>Soyad</th>
                    <th>Kullanıcı ID</th>
                    <th>Kullanıcı Adı</th>
                    <th>Email</th>
                    <th>Lokasyon</th>
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
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {session.sessionId}
                    </td>
                    {isMobile ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {session.user?.ad}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {session.user?.soyad}
                        </td>
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
                          {session.user?.kullanici_adi || "-"}
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
                          {(() => {
                            const locId = session.user?.lokasyonId;
                            const institution = institutions.find(
                              (inst) => inst.id === locId
                            );
                            return institution ? institution.name : "-";
                          })()}
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
                  <td colSpan={isMobile ? 4 : 11} className="text-center">
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
