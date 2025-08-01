import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserTeoExamsThunk } from "../../../features/thunks/examThunk";
import "./TeoExams.css";

export default function TeoExams() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, isLoading } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(getUserTeoExamsThunk());
  }, [dispatch]);

  const handleStartExam = (examId, sonucGizle) => {
    navigate(`/teo-questions/${examId}`, {
      state: { sonucGizle }, // 👈 burada veriyi gönderiyoruz
    });
  };

  
  console.log(exams);
  const activeExams =
    exams?.filter((exam) => {
      const user = exam.examUsers?.[0];
      if (!user) return false;

      const isNotCompleted = user.completed === false;
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
    <div className="teo-exams-container">
      <h2 className="teo-exams-header">
        <i className="bi bi-journal-text me-2" style={{ color: "#001b66" }}></i>
        Teorik Sınavlar
      </h2>

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

        const now = new Date();
        const examStartDateTime = new Date(
          `${exam.start_date}T${exam.start_time}`
        );
        const canStartByTime = now >= examStartDateTime;

        const user = exam.examUsers?.[0];
        const attemptLimit = exam.attemp_limit ?? 0;
        const currentAttempts = user?.attempt_count ?? 0;

        const hasAttemptRight =
          attemptLimit === 0 || currentAttempts < attemptLimit;
        const canStart = canStartByTime && hasAttemptRight;

        return (
          <div key={exam.id} className="teo-exam-card">
            <h5 className="teo-exam-title">{exam.name}</h5>
            <div className="teo-exam-info">
              <p>
                <i
                  className="bi bi-journal-text"
                  style={{ color: "#0056cc" }}
                ></i>{" "}
                <strong>Sınav Türü:</strong> Teorik
              </p>
              <p>
                <i
                  className="bi bi-calendar-event"
                  style={{ color: "#0056cc" }}
                ></i>{" "}
                <strong>Başlangıç:</strong> {startDate} - {exam.start_time}
              </p>
              <p>
                <i
                  className="bi bi-calendar-x"
                  style={{ color: "#0056cc" }}
                ></i>{" "}
                <strong>Bitiş:</strong> {endDate} - {exam.end_time}
              </p>
              <p>
                <i className="bi bi-clock" style={{ color: "#0056cc" }}></i>{" "}
                <strong>Sınav Süresi:</strong> {exam.sure} dakika
              </p>
              <p>
                <i
                  className="bi bi-check-circle"
                  style={{ color: "#0056cc" }}
                ></i>{" "}
                <strong>Geçme Puanı:</strong> {exam.passing_score}
              </p>
              <p>
                <i
                  className="bi bi-arrow-repeat"
                  style={{ color: "#0056cc" }}
                ></i>{" "}
                <strong>Hakkınız:</strong>{" "}
                {attemptLimit === 0
                  ? "Sınırsız"
                  : `${currentAttempts} / ${attemptLimit}`}
              </p>
            </div>

            <button
              onClick={() => handleStartExam(exam.id, exam.sonucu_gizle)} // 👈 burada gönderiyoruz
              className={`btn-start-exam-teo mt-auto ${
                !canStart ? "btn-secondary" : ""
              }`}
              aria-label={`Sınavı Başlat: ${exam.name}`}
              disabled={!canStart}
              title={
                !canStartByTime
                  ? "Sınav henüz başlamadı."
                  : !hasAttemptRight
                  ? "Sınav giriş hakkınız kalmadı."
                  : undefined
              }
            >
              Sınavı Başlat
            </button>
          </div>
        );
      })}
    </div>
  );
}
