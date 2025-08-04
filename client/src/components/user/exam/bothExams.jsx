import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserUnifiedExamsThunk } from "../../../features/thunks/examThunk";
import "./BothExams.css";

export default function BothExams() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, isLoading } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(getUserUnifiedExamsThunk());
  }, [dispatch]);

  const handleStartExam = (teoId, imgId, sonucGizle) => {
    navigate(`/both-teo-questions/${teoId}`, {
      state: { nextExamId: imgId, sonucGizle },
    });
  };
  console.log("exams:", exams);

  // examUsers dizisi varsa, ilkinin completed değeri false olanları alıyoruz
  const activeExams =
    exams?.filter(({ teo }) => {
      if (!teo) return false;

      // Sınav bitiş zamanı
      const examEndDateTime = new Date(`${teo.end_date}T${teo.end_time}`);
      const now = new Date();

      // Henüz sınav bitmemiş olmalı
      const isBeforeEnd = now <= examEndDateTime;

      return isBeforeEnd;
    }) || [];

  if (isLoading)
    return (
      <div className="loading-container">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-hidden="true"
        ></div>
        <span className="loading-text">Yükleniyor...</span>
      </div>
    );

  if (activeExams.length === 0)
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

  return (
    <div className="both-exams-container">
      <h2 className="both-exams-header">
        <i className="bi bi-journal-text me-2"></i>Karma Sınavlar
      </h2>

      <div className="row g-4">
        {activeExams.map(({ unifiedId, teo, img }) => {
          if (!teo) return null;

          const examStartDateTime = new Date(
            `${teo.start_date}T${teo.start_time}`
          );
          const now = new Date();
          const canStartByTime = now >= examStartDateTime;

          const user = teo.examUsers?.[0] || {};
          const attempCount = user.attemp_count;
          const attemptLimit = teo.attemp_limit ?? 0;

          // Kalan hak hesabı
          const remainingAttempts =
            // Eğer attemp_limit 100'den büyükse, hakkı sınırsızdır.
            attemptLimit > 100
              ? "Sınırsız"
              : // attemp_count değeri null ise, bu sınav hiç denenmemiştir.
              // Bu durumda kalan hak, sınavın toplam hakkı olan `attemptLimit` değeridir.
              attempCount === null
              ? attemptLimit
              : // Aksi takdirde, kalan hak `attemp_count` değeridir.
                attempCount;

          const hasAttemptRight =
            remainingAttempts === "Sınırsız" ||
            (typeof remainingAttempts === "number" && remainingAttempts > 0);

          // Butonun aktif olup olmaması
          const canStart = canStartByTime && hasAttemptRight;

          const examStartDate = new Date(teo.start_date).toLocaleDateString(
            "tr-TR",
            {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );
          const examEndDate = new Date(teo.end_date).toLocaleDateString(
            "tr-TR",
            {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

          // Süre hesaplamaları (senin koddan)
          const imgQuestionCount = img?.question_count || 0;
          const imgSureSeconds = img?.sure || 0;
          const imgDurationMinutes = (imgQuestionCount * imgSureSeconds) / 60;
          const totalDuration = Math.round(
            Number(teo.sure) + imgDurationMinutes
          );

          return (
            <div key={unifiedId} className="col-12">
              <div className="exam-card">
                <h3 className="exam-title">{teo.name}</h3>

                <ul className="exam-details-list">
                  <li>
                    <strong>Sınav Türü:</strong> Karma (Teorik + Uygulama)
                  </li>
                  <li>
                    <strong>Başlangıç Tarihi:</strong> {examStartDate}-{" "}
                    {teo.start_time}
                  </li>
                  <li>
                    <strong>Bitiş Tarihi:</strong> {examEndDate}- {img.end_time}
                  </li>
                  <li>
                    <strong>Sınav Süresi Toplam:</strong> {totalDuration} dk
                  </li>
                  <li>
                    <strong>Teorik Sınav Süresi:</strong>{" "}
                    {teo.sure === 999999 ? "Süresiz" : `${teo.sure} dakika`}
                  </li>
                  {img && (
                    <li>
                      <strong>Uygulamalı Sınav Süresi:</strong>{" "}
                      {Math.round((img.sure * img.question_count) / 60)} dk
                    </li>
                  )}
                  <li>
                    <strong>Geçme Puanı:</strong> {teo.passing_score}
                  </li>
                  <li>
                    <strong>Kalan Deneme Hakkı:</strong>{" "}
                    {
                      typeof remainingAttempts === "number"
                        ? remainingAttempts
                        : remainingAttempts /* Sınırsız */
                    }
                  </li>
                </ul>

                {img && (
                  <div className="mt-auto">
                    <p className="info-text">
                      <i className="bi bi-info-circle icon"></i> Teorik sınav
                      bittikten sonra uygulama sınavına geçiş yapabilirsiniz.
                    </p>
                    <button
                      onClick={() =>
                        handleStartExam(teo.id, img.id, teo.sonucu_gizle)
                      }
                      className={`start-btn ${
                        !canStart ? "btn-secondary" : ""
                      }`}
                      aria-label={`Karma sınavı başlat: ${teo.name}`}
                      disabled={!canStart}
                      title={
                        !canStartByTime
                          ? "Sınav henüz başlamadı."
                          : !hasAttemptRight
                          ? "Sınav giriş hakkınız kalmadı."
                          : undefined
                      }
                    >
                      Sınava Başla
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
