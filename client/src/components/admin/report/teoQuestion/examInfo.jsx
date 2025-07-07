import React from "react";

export default function ExamInfoCard({ exam, userExam }) {
  if (!exam) return null;

  const { name, question_count, start_date, start_time, sure, timed } = exam;

  return (
    <div
      className="card shadow-sm border-0"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <div
        className="card-header text-white text-center fw-semibold"
        style={{ backgroundColor: "#001b66" }}
      >
        <i
          className="bi bi-file-earmark-fill me-2"
          style={{ color: "white" }}
        ></i>
        Sınav Bilgileri
      </div>
      <div className="card-body text-dark">
        <InfoItem label="Sınav Adı" value={name} />
        <InfoItem label="Toplam Soru" value={question_count} />
        <InfoItem label="Süre" value={timed ? `${sure} dakika` : "Zamansız"} />
        <InfoItem label="Sınav Tarihi" value={start_date} />
        <InfoItem label="Sınav Saati" value={start_time} />

        {userExam && (
          <>
            <hr />
            <InfoItem
              label="Giriş"
              value={`${userExam.entry_date} ${userExam.entry_time}`}
            />
            <InfoItem label="Skor" value={userExam.score} />
            <div className="d-flex justify-content-between">
              <span className="fw-semibold">Durum:</span>
              <span
                className={`fw-bold ${
                  userExam.pass ? "text-success" : "text-danger"
                }`}
              >
                {userExam.pass ? "Başarılı" : "Başarısız"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="d-flex justify-content-between mb-2">
      <span className="fw-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
