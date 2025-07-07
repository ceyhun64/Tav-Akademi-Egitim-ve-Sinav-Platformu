import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./exam-info.css";

export default function ExamInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teoExams = [], imgExams = [] } = location.state || {};

  const handleStartExam = () => {
    if (teoExams.length > 0 && imgExams.length > 0) {
      navigate(`/both-teo-questions/${teoExams[0].id}`, {
        state: { teoExams, imgExams },
      });
    } else if (teoExams.length > 0) {
      navigate(`/teo-questions/${teoExams[0].id}`, {
        state: { teoExams },
      });
    } else if (imgExams.length > 0) {
      navigate(`/img-questions/${imgExams[0].id}`, {
        state: { imgExams },
      });
    } else {
      alert("Sınav bulunamadı.");
    }
  };

  return (
    <div className="exam-info-container">
      <h2 className="exam-info-header">Sınavlara Hazır Mısınız?</h2>
      <p className="exam-info-subtitle">
        Aşağıda sınav detaylarını görebilirsiniz:
      </p>

      {teoExams.length > 0 && (
        <div className="exam-card exam-card-teo">
          <div className="card-title">
            <i className="bi bi-book" style={{ fontSize: "24px" }}></i>
            <span>Teorik Sınav</span>
          </div>
          <div className="info-row">
            <strong>Ad:</strong> {teoExams[0].name}
          </div>
          <div className="info-row">
            <i className="bi bi-calendar-event info-icon"></i> Başlangıç:{" "}
            {teoExams[0].start_date} <i className="bi bi-clock info-icon"></i>{" "}
            {teoExams[0].start_time}
          </div>
          <div className="info-row">
            <i className="bi bi-calendar-event info-icon"></i> Bitiş:{" "}
            {teoExams[0].end_date} <i className="bi bi-clock info-icon"></i>{" "}
            {teoExams[0].end_time}
          </div>
        </div>
      )}

      {imgExams.length > 0 && (
        <div className="exam-card exam-card-img">
          <div className="card-title">
            <i className="bi bi-images" style={{ fontSize: "24px" }}></i>
            <span>Görsel Sınav</span>
          </div>
          <div className="info-row">
            <strong>Ad:</strong> {imgExams[0].name}
          </div>
          <div className="info-row">
            <i className="bi bi-calendar-event info-icon"></i> Başlangıç:{" "}
            {imgExams[0].start_date} <i className="bi bi-clock info-icon"></i>{" "}
            {imgExams[0].start_time}
          </div>
          <div className="info-row">
            <i className="bi bi-calendar-event info-icon"></i> Bitiş:{" "}
            {imgExams[0].end_date} <i className="bi bi-clock info-icon"></i>{" "}
            {imgExams[0].end_time}
          </div>
        </div>
      )}

      <button className="btn-start-exam" onClick={handleStartExam}>
        Sınava Başla
      </button>
    </div>
  );
}
