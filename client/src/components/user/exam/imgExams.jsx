import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserImgExamsThunk } from "../../../features/thunks/examThunk";
import background3 from "../../../../public/background/background3.jpg";
import "./ImgExams.css";

export default function ImgExams() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, isLoading } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(getUserImgExamsThunk());
  }, [dispatch]);

  const handleStartExam = (examId) => {
    navigate(`/img-questions/${examId}`);
  };

  console.log(exams);
  const activeExams =
    exams?.filter((exam) => {
      if (!exam.examUsers?.[0]) return false;

      const isNotCompleted = exam.examUsers[0].completed === false;

      const examEndDateTime = new Date(`${exam.end_date}T${exam.end_time}`);
      const now = new Date();
      const isBeforeEnd = now <= examEndDateTime;

      return isNotCompleted && isBeforeEnd;
    }) || [];

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          aria-hidden="true"
        ></div>
        <span className="ms-2">Yükleniyor...</span>
      </div>
    );
  }

  if (activeExams.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div
          className="text-center p-4 border rounded shadow-sm"
          style={{ maxWidth: "400px", backgroundColor: "#f8f9fa" }}
        >
          <i className="bi bi-calendar-x fs-1 text-secondary mb-3"></i>
          <h5 className="text-secondary">Aktif sınavınız bulunmamaktadır.</h5>
          <p className="text-muted">
            Yeni sınav atandığında burada görünecektir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="img-exams-container">
      <h2 className="img-exams-header">
        <i className="bi bi-image me-2" style={{ color: "#001b66" }}></i>
        Uygulama Sınavları
      </h2>

      <div className="row g-4">
        {activeExams.map((exam) => {
          const startDate = new Date(exam.start_date).toLocaleDateString(
            "tr-TR",
            {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

          const endDate = new Date(exam.end_date).toLocaleDateString("tr-TR", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const examStartDateTime = new Date(
            `${exam.start_date}T${exam.start_time}`
          );
          const now = new Date();
          const canStart = now >= examStartDateTime;

          return (
            <div key={exam.id} className="col-12">
              <div className="img-exam-card">
                <h5 className="img-exam-title">{exam.name}</h5>

                <ul className="img-exam-info-list">
                  <li>
                    <i
                      className="bi bi-file-earmark-image"
                      style={{ color: "#0056cc" }}
                    ></i>
                    <strong>Sınav Türü:</strong> Uygulama
                  </li>
                  <li>
                    <i
                      className="bi bi-calendar-event"
                      style={{ color: "#0056cc" }}
                    ></i>
                    <strong>Başlangıç:</strong> {startDate} - {exam.start_time}
                  </li>
                  <li>
                    <i
                      className="bi bi-calendar-x"
                      style={{ color: "#0056cc" }}
                    ></i>
                    <strong>Bitiş:</strong> {endDate} - {exam.end_time}
                  </li>
                  <li>
                    <i className="bi bi-clock" style={{ color: "#0056cc" }}></i>
                    <strong>Sınav Süresi:</strong> {exam.sure} dakika
                  </li>

                  <li>
                    <i
                      className="bi bi-check-circle"
                      style={{ color: "#0056cc" }}
                    ></i>
                    <strong>Geçme Puanı:</strong> {exam.passing_score}
                  </li>
                </ul>
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className={`btn-start-exam mt-auto ${
                    !canStart ? "btn-secondary" : ""
                  }`}
                  aria-label={`Sınavı Başlat: ${exam.name}`}
                  disabled={!canStart}
                  title={!canStart ? "Sınav henüz başlamadı." : undefined}
                >
                  Sınavı Başlat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
