import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEducationSetByIdThunk } from "../../../features/thunks/educationSetThunk";
import background1 from "../../../../public/background/background2.jpg"; // Adjust the path as necessary

export default function UserEducationSetDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { educationSet } = useSelector((state) => state.educationSet);

  const eduDetail = educationSet?.educationSet;
  const eduEducations = educationSet?.educations;
  const eduTeoExams = educationSet?.teoExams;
  const eduImgExams = educationSet?.imgExams;
  const eduSetUser = educationSet?.educationSetUser;
  const [eduIds, setEduIds] = useState([]);

  useEffect(() => {
    dispatch(getEducationSetByIdThunk(id))
      .unwrap()
      .then((result) => {
        const educationIds = result.educations?.map((edu) => edu.id) || [];
        setEduIds(educationIds);
      })
      .catch((error) => {
        console.error("Eğitim seti çekilirken hata oluştu:", error);
      });
  }, [dispatch, id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Belirtilmemiş";
    return new Date(dateStr).toLocaleDateString("tr-TR");
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Belirtilmemiş";
    const [h, m] = timeStr.split(":");
    return `${h}:${m}`;
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "Belirtilmemiş";
    return `${formatDate(dateStr)} ${formatTime(timeStr)}`;
  };

  const handleStartEducation = () => {
    if (eduIds.length > 0) {
      navigate(`/education/${eduIds[0]}`, {
        state: {
          eduIds,
          teoExams: eduTeoExams || [],
          imgExams: eduImgExams || [],
          educationSetId: id,
        },
      });
    }
  };

  if (!eduDetail) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div
      className="container my-5 p-4 rounded-3 position-relative"
      style={{ zIndex: 0 }}
    >
      {/* Transparan arkaplan resmi */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${background1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.1, // Görünürlüğü azaltmak için opacity burada
          borderRadius: "1rem",
          zIndex: -1,
        }}
      />
      <h2 className="mb-4 text-center fw-bold" style={{ color: "#001b66" }}>
        <i className="bi bi-journal-bookmark-fill me-2"></i>
        Eğitim Seti Detayı
      </h2>

      <div className="card shadow-sm mb-5 border-0 rounded-4 border-start border-5 border-primary bg-white bg-opacity-95">
        <div className="card-body">
          <h3 className="text-primary fw-semibold">{eduDetail.name}</h3>
          <div className="row mt-4 text-secondary">
            <div className="col-md-6 mb-3">
              <strong>Başlangıç Tarihi:</strong>{" "}
              <span className="badge bg-primary">
                {formatDate(eduSetUser?.start_date || eduDetail.start_date)}
              </span>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Bitiş Tarihi:</strong>{" "}
              <span className="badge bg-primary">
                {formatDate(eduSetUser?.end_date || eduDetail.end_date)}
              </span>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Başlangıç Saati:</strong>{" "}
              <span className="badge bg-info">
                {formatTime(eduSetUser?.start_time || eduDetail.start_time)}
              </span>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Bitiş Saati:</strong>{" "}
              <span className="badge bg-info">
                {formatTime(eduSetUser?.end_time || eduDetail.end_time)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-5 g-4">
        <section className="col-md-6">
          <h4 className="border-bottom pb-2 mb-3 text-primary fw-semibold">
            <i className="bi bi-book me-2"></i> Dersler
          </h4>
          {eduEducations?.length ? (
            <ul className="list-group shadow-sm rounded-4">
              {eduEducations.map((edu) => (
                <li
                  key={edu.id}
                  className="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div>
                    <strong className="text-secondary">{edu.name}</strong>{" "}
                    <small className="text-muted">({edu.type})</small>
                    <div className="small text-muted">
                      Süre: {edu.duration} sn
                      {edu.type === "pdf" &&
                        edu.num_pages &&
                        ` - Sayfa: ${edu.num_pages}`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Ders bulunamadı.</p>
          )}
        </section>

        <section className="col-md-6">
          <h4 className="border-bottom pb-2 mb-3 text-primary fw-semibold">
            <i className="bi bi-pencil-square me-2"></i> Teorik Sınavlar
          </h4>
          {eduTeoExams?.length ? (
            <ul className="list-group shadow-sm rounded-4 mb-4">
              {eduTeoExams.map((exam) => (
                <li
                  key={exam.id}
                  className="list-group-item rounded-3 mb-2 d-flex flex-column flex-md-row justify-content-between"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div>
                    <strong className="text-secondary">{exam.name}</strong>
                    <div className="small text-muted mt-1">
                      <i className="bi bi-calendar-event me-1"></i>
                      Başlangıç:{" "}
                      <span className="badge bg-primary me-2">
                        {formatDateTime(exam.start_date, exam.start_time)}
                      </span>
                      <i className="bi bi-calendar-x me-1"></i>
                      Bitiş:{" "}
                      <span className="badge bg-primary">
                        {formatDateTime(exam.end_date, exam.end_time)}
                      </span>
                    </div>
                    <div className="small text-muted mt-1">
                      <i className="bi bi-check-circle me-1"></i>
                      Geçme Notu: {exam.passing_score_teo ??
                        "Belirtilmemiş"} | <i className="bi bi-clock me-1"></i>
                      Süre: {exam.sure_teo ?? "Belirtilmemiş"} dk
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Tanımlı teorik sınav yok.</p>
          )}

          <h4 className="border-bottom pb-2 mb-3 text-primary fw-semibold">
            <i className="bi bi-image me-2"></i> Görsel Sınavlar
          </h4>
          {eduImgExams?.length ? (
            <ul className="list-group shadow-sm rounded-4">
              {eduImgExams.map((exam) => (
                <li
                  key={exam.id}
                  className="list-group-item rounded-3 mb-2 d-flex flex-column flex-md-row justify-content-between"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <div>
                    <strong className="text-secondary">{exam.name}</strong>
                    <div className="small text-muted mt-1">
                      <i className="bi bi-calendar-event me-1"></i>
                      Başlangıç:{" "}
                      <span className="badge bg-info me-2">
                        {formatDateTime(exam.start_date, exam.start_time)}
                      </span>
                      <i className="bi bi-calendar-x me-1"></i>
                      Bitiş:{" "}
                      <span className="badge bg-info">
                        {formatDateTime(exam.end_date, exam.end_time)}
                      </span>
                    </div>
                    <div className="small text-muted mt-1">
                      <i className="bi bi-check-circle me-1"></i>
                      Geçme Notu: {exam.passing_score ?? "Belirtilmemiş"} |{" "}
                      <i className="bi bi-clock me-1"></i>
                      Süre: {exam.sure ?? "Belirtilmemiş"} dk |{" "}
                      <i className="bi bi-question-circle me-1"></i>
                      Soru Sayısı: {exam.question_count ?? "Belirtilmemiş"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Tanımlı görsel sınav yok.</p>
          )}
        </section>
      </div>

      <div className="text-center">
        <button
          onClick={handleStartEducation}
          className="btn btn-lg px-5 rounded-pill fw-bold text-white"
          style={{
            background: "linear-gradient(90deg, #003566 0%, #0077b6 100%)",
            boxShadow: "0 4px 12px rgb(0 119 182 / 0.4)",
          }}
        >
          <i className="bi bi-play-circle me-2"></i> Eğitimi Başlat
        </button>
      </div>
    </div>
  );
}
