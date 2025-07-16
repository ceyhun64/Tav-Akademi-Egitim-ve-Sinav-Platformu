import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEducationSetByIdThunk } from "../../../features/thunks/educationSetThunk";
import Sidebar from "../adminPanel/sidebar";

export default function EducationSetDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { educationSet } = useSelector((state) => state.educationSet);
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
  const eduDetail = educationSet?.educationSet;
  const eduEducations = educationSet?.educations;
  const eduTeoExams = educationSet?.teoExams;
  const eduImgExams = educationSet?.imgExams;

  useEffect(() => {
    dispatch(getEducationSetByIdThunk(id));
  }, [dispatch, id]);

  if (!eduDetail) {
    return <p>Yükleniyor...</p>;
  }

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
            Eğitim Seti Detayı
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "30px",
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px", // padding yatay biraz artırıldı
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap", // metnin tek satırda kalmasını sağlar
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>
        <div
          className="container-fluid"
          style={{
            padding: isMobile ? "1rem" : "2rem",
            backgroundColor: "#f8f9fc",
            minHeight: isMobile ? "auto" : "100vh",
            flex: 1,
          }}
        >
          {/* Başlık */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h2
              className="text-primary fw-semibold fs-4"
              style={{ flexGrow: 1 }}
            >
              <i className="bi bi-collection-fill me-2"></i>
              {eduDetail.name}
            </h2>
          </div>

          {/* Dersler */}
          <h3 className="text-primary mb-3">
            <i className="bi bi-journal-bookmark me-2"></i>Dersler
          </h3>
          <div className={`row g-3 mb-5`}>
            {eduEducations?.map((edu) => {
              const fileType = edu.file_url?.split(".").pop()?.toLowerCase();
              return (
                <div
                  key={edu.id}
                  className={isMobile ? "col-12" : "col-12 col-md-6 col-lg-4"}
                >
                  <div className="card shadow-sm h-100 d-flex flex-column">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title d-flex align-items-center mb-2">
                        <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                        {edu.name}
                      </h5>
                      <p className="text-muted mb-3">
                        {edu.type} &nbsp;|&nbsp; Süre: {edu.duration} sn
                      </p>
                      <div className="mt-auto">
                        {fileType === "mp4" ? (
                          <video
                            src={edu.file_url}
                            controls
                            className="w-100 rounded"
                            style={{ maxHeight: "180px", objectFit: "cover" }}
                          />
                        ) : fileType === "pdf" ? (
                          <a
                            href={edu.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-file-earmark-pdf me-2"></i> PDF
                            Görüntüle
                          </a>
                        ) : (
                          <span className="text-danger d-inline-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            Desteklenmeyen dosya türü
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sınavlar */}
          <h3 className="text-primary mb-4">
            <i className="bi bi-pencil-square me-2"></i>Sınavlar
          </h3>

          {isMobile ? (
            <>
              {/* Mobilde tek sütun */}
              <div className="mb-4">
                <h4 className="mb-3 text-secondary">Teorik Sınavlar</h4>
                {eduTeoExams?.length === 0 ? (
                  <p className="text-muted fst-italic">
                    Teorik sınav bulunmamaktadır.
                  </p>
                ) : (
                  eduTeoExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="card mb-3 shadow-sm border-primary"
                      style={{ borderWidth: "2px" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{exam.name}</h5>
                        <p className="mb-1">
                          <strong>Tarih:</strong> {exam.start_date}{" "}
                          {exam.start_time} - {exam.end_date} {exam.end_time}
                        </p>
                        <p className="mb-1">
                          <strong>Soru Sayısı:</strong> {exam.question_count} |{" "}
                          <strong>Süre:</strong> {exam.sure} dk
                        </p>
                        <p className="mb-1">
                          <strong>Geçme Notu:</strong> {exam.passing_score} |{" "}
                          <strong>Deneme Hakkı:</strong> {exam.attemp_limit}
                        </p>
                        <p className="mb-1">
                          <strong>Zamanlı mı?</strong>{" "}
                          {exam.timed ? "Evet" : "Hayır"} |{" "}
                          <strong>Sonuç Gizli mi?</strong>{" "}
                          {exam.sonucu_gizle ? "Evet" : "Hayır"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mb-4">
                <h4 className="mb-3 text-secondary">Uygulamalı Sınavlar</h4>
                {eduImgExams?.length === 0 ? (
                  <p className="text-muted fst-italic">
                    Uygulamalı sınav bulunmamaktadır.
                  </p>
                ) : (
                  eduImgExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="card mb-3 shadow-sm border-success"
                      style={{ borderWidth: "2px" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{exam.name}</h5>
                        <p className="mb-1">
                          <strong>Tarih:</strong> {exam.start_date}{" "}
                          {exam.start_time} - {exam.end_date} {exam.end_time}
                        </p>
                        <p className="mb-1">
                          <strong>Soru Sayısı:</strong> {exam.question_count} |{" "}
                          <strong>Süre:</strong> {exam.sure} dk
                        </p>
                        <p className="mb-1">
                          <strong>Geçme Notu:</strong> {exam.passing_score} |{" "}
                          <strong>Deneme Hakkı:</strong> {exam.attemp_limit}
                        </p>
                        <p className="mb-1">
                          <strong>Zamanlı mı?</strong>{" "}
                          {exam.timed ? "Evet" : "Hayır"} |{" "}
                          <strong>Sonuç Gizli mi?</strong>{" "}
                          {exam.sonucu_gizle ? "Evet" : "Hayır"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            // Masaüstü 2 sütun
            <div className="row">
              <div className="col-md-6 mb-4">
                <h4 className="mb-3 text-secondary">Teorik Sınavlar</h4>
                {eduTeoExams?.length === 0 ? (
                  <p className="text-muted fst-italic">
                    Teorik sınav bulunmamaktadır.
                  </p>
                ) : (
                  eduTeoExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="card mb-3 shadow-sm border-primary"
                      style={{ borderWidth: "2px" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{exam.name}</h5>
                        <p className="mb-1">
                          <strong>Tarih:</strong> {exam.start_date}{" "}
                          {exam.start_time} - {exam.end_date} {exam.end_time}
                        </p>
                        <p className="mb-1">
                          <strong>Soru Sayısı:</strong> {exam.question_count} |{" "}
                          <strong>Süre:</strong> {exam.sure} dk
                        </p>
                        <p className="mb-1">
                          <strong>Geçme Notu:</strong> {exam.passing_score} |{" "}
                          <strong>Deneme Hakkı:</strong> {exam.attemp_limit}
                        </p>
                        <p className="mb-1">
                          <strong>Zamanlı mı?</strong>{" "}
                          {exam.timed ? "Evet" : "Hayır"} |{" "}
                          <strong>Sonuç Gizli mi?</strong>{" "}
                          {exam.sonucu_gizle ? "Evet" : "Hayır"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="col-md-6 mb-4">
                <h4 className="mb-3 text-secondary">Uygulamalı Sınavlar</h4>
                {eduImgExams?.length === 0 ? (
                  <p className="text-muted fst-italic">
                    Uygulamalı sınav bulunmamaktadır.
                  </p>
                ) : (
                  eduImgExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="card mb-3 shadow-sm border-success"
                      style={{ borderWidth: "2px" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{exam.name}</h5>
                        <p className="mb-1">
                          <strong>Tarih:</strong> {exam.start_date}{" "}
                          {exam.start_time} - {exam.end_date} {exam.end_time}
                        </p>
                        <p className="mb-1">
                          <strong>Soru Sayısı:</strong> {exam.question_count} |{" "}
                          <strong>Süre:</strong> {exam.sure} dk
                        </p>
                        <p className="mb-1">
                          <strong>Geçme Notu:</strong> {exam.passing_score} |{" "}
                          <strong>Deneme Hakkı:</strong> {exam.attemp_limit}
                        </p>
                        <p className="mb-1">
                          <strong>Zamanlı mı?</strong>{" "}
                          {exam.timed ? "Evet" : "Hayır"} |{" "}
                          <strong>Sonuç Gizli mi?</strong>{" "}
                          {exam.sonucu_gizle ? "Evet" : "Hayır"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
