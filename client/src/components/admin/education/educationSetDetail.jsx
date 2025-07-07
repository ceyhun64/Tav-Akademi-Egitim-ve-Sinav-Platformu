import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEducationSetByIdThunk } from "../../../features/thunks/educationSetThunk";
import Sidebar from "../adminPanel/sidebar";

export default function EducationSetDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { educationSet } = useSelector((state) => state.educationSet);

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
    <div className="poolteo-container d-flex">
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="container-fluid"
        style={{
          marginLeft: "260px",
          padding: "2rem",
          backgroundColor: "#f8f9fc",
          minHeight: "100vh",
          flex: 1,
        }}
      >
        {/* Başlık */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-semibold fs-4">
            <i className="bi bi-collection-fill me-2"></i>
            {eduDetail.name}
          </h2>
        </div>

        {/* Dersler */}
        <h3 className="text-primary mb-3">
          <i className="bi bi-journal-bookmark me-2"></i>Dersler
        </h3>
        <div className="row g-3 mb-5">
          {eduEducations?.map((edu) => {
            const fileType = edu.file_url?.split(".").pop();
            return (
              <div className="col-12 col-md-6 col-lg-4" key={edu.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title d-flex align-items-center">
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
                        <span className="text-danger">
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
        <div className="row">
          {/* Teorik Sınavlar */}
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

          {/* Uygulamalı Sınavlar */}
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
      </div>
    </div>
  );
}
