import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExamByUserIdThunk } from "../../../features/thunks/examThunk";
import dayjs from "dayjs";

export default function UpcomingExam() {
  const dispatch = useDispatch();
  const { exams } = useSelector((state) => state.exam);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    dispatch(getExamByUserIdThunk());
  }, [dispatch]);

  useEffect(() => {
    if (exams?.length > 0) {
      const today = dayjs().startOf("day");

      const filtered = exams
        .filter((exam) => dayjs(exam.start_date).isAfter(today))
        .map((exam) => {
          const examDate = dayjs(exam.start_date);
          const daysLeft = examDate.diff(today, "day");
          return { ...exam, daysLeft };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft);

      setUpcomingExams(filtered);
    }
  }, [exams]);

  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const daysInMonth = today.daysInMonth();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );

  // Sınav günlerini string formatta sakla (örn: "2025-06-28")
  const examDays = upcomingExams.map((exam) =>
    dayjs(exam.start_date).format("YYYY-MM-DD")
  );

  // Filtrelenmiş ve aranan sınavlar
  const filteredExams = upcomingExams.filter((exam) => {
    const matchesSearch = exam.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || exam.exam_type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Seçili günün sınavları
  const examsOnSelectedDate = selectedDate
    ? upcomingExams.filter(
        (exam) => dayjs(exam.start_date).format("YYYY-MM-DD") === selectedDate
      )
    : [];

  return (
    <div className="container py-5 ">
      <div className="row">
        {/* Sağ - Yaklaşan Sınavlar ve Detaylar */}
        <div className="col-md-8">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#001b66" }}>
            Yaklaşan Sınavlar <i className="bi bi-clock-history ms-2"></i>
          </h2>

          {/* Arama ve Filtre */}
          <div className="d-flex mb-4 gap-3">
            <input
              type="text"
              className="form-control border-primary"
              placeholder="Sınav adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: "#001b66" }}
            />
            <select
              className="form-select border-primary"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ borderColor: "#001b66" }}
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="teo">Teorik</option>
              <option value="img">Uygulama</option>
              <option value="unified">Birleşik</option>
            </select>
          </div>

          {/* Seçilen Günün Detayları */}
          {selectedDate && examsOnSelectedDate.length > 0 && (
            <div
              className="mb-4 p-3 border rounded bg-light"
              style={{ borderColor: "#001b66" }}
            >
              <h4 style={{ color: "#001b66" }}>
                {dayjs(selectedDate).format("DD MMMM YYYY")} tarihindeki
                sınavlar <i className="bi bi-calendar-check-fill"></i>
              </h4>
              {examsOnSelectedDate.map((exam) => (
                <div key={exam.id} className="mb-3">
                  <h5 className="fw-semibold" style={{ color: "#001b66" }}>
                    {exam.name} <i className="bi bi-journal-text"></i>
                  </h5>
                  <p>
                    <strong>Kategori:</strong>{" "}
                    {exam.category || "Belirtilmemiş"}{" "}
                    <i className="bi bi-tags"></i>
                  </p>
                  <p>
                    <strong>Süre:</strong>{" "}
                    {dayjs(exam.start_date).format("HH:mm")} -{" "}
                    {exam.end_date
                      ? dayjs(exam.end_date).format("HH:mm")
                      : "Bilinmiyor"}{" "}
                    <i className="bi bi-clock"></i>
                  </p>
                  <p>{exam.description || "Açıklama yok."}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sınav Listesi */}
          {filteredExams.length === 0 ? (
            <div
              className="alert alert-warning d-flex align-items-center gap-2"
              role="alert"
            >
              <i className="bi bi-calendar-x fs-5"></i>
              <span className="fw-semibold">
                Yaklaşan sınav bulunmamaktadır.
              </span>
            </div>
          ) : (
            <div className="row g-4">
              {filteredExams.map((exam) => {
                const examDate = dayjs(exam.start_date);
                const daysLeft = exam.daysLeft;

                // Durum etiketi
                let statusTag;
                if (daysLeft === 0)
                  statusTag = (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#001b66",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Bugün <i className="bi bi-calendar-day ms-1"></i>
                    </span>
                  );
                else if (daysLeft < 5)
                  statusTag = (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#001b66",
                        fontWeight: "600",
                      }}
                    >
                      Yaklaşıyor{" "}
                      <i className="bi bi-exclamation-triangle ms-1"></i>
                    </span>
                  );

                return (
                  <div key={exam.id} className="col-12">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5
                            className="card-title fw-semibold"
                            style={{ color: "#001b66" }}
                          >
                            {exam.name} <i className="bi bi-bookmark-fill"></i>
                          </h5>
                          {statusTag}
                        </div>
                        <p className="card-text text-muted mb-1">
                          <i
                            className="bi bi-calendar-event me-2"
                            style={{ color: "#001b66" }}
                          ></i>
                          {examDate.format("DD MMMM YYYY")}
                        </p>
                        <p className="card-text text-muted mb-1">
                          <i
                            className="bi bi-clock me-2"
                            style={{ color: "#d6336c" }}
                          ></i>
                          {daysLeft} gün kaldı
                        </p>
                        <p className="card-text text-muted mb-1">
                          <strong>Kategori:</strong>{" "}
                          {exam.category || "Belirtilmemiş"}
                        </p>
                        <p className="card-text">
                          {exam.description || "Açıklama yok."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Sol - Takvim */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <i
                className="bi bi-calendar3 text-primary fs-2 mb-2"
                style={{ color: "#001b66" }}
              ></i>

              <p className="mb-3 fw-semibold" style={{ color: "#001b66" }}>
                Bugün: {today.format("dddd, DD MMMM YYYY")}
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-2">
                {daysArray.map((day) => {
                  const isToday = day.isSame(today, "day");
                  const dayStr = day.format("YYYY-MM-DD");
                  const isExamDay = examDays.includes(dayStr);
                  const isSelected = selectedDate === dayStr;

                  let classNames = "p-2 border rounded cursor-pointer";
                  if (isSelected) classNames += " bg-info text-white";
                  else if (isToday) classNames += " bg-primary text-white";
                  else if (isExamDay)
                    classNames += " bg-warning text-dark fw-bold";
                  else classNames += " text-muted";

                  return (
                    <div
                      key={day.format("DD-MM-YYYY")}
                      className={classNames}
                      style={{
                        width: "40px",
                        textAlign: "center",
                        position: "relative",
                        userSelect: "none",
                      }}
                      onClick={() => setSelectedDate(dayStr)}
                      title={isExamDay ? "Sınav Günü" : ""}
                    >
                      {day.format("D")}
                      {isExamDay && (
                        <i
                          className="bi bi-pencil-fill"
                          style={{
                            fontSize: "0.65rem",
                            position: "absolute",
                            bottom: "2px",
                            right: "4px",
                            color: "#d6336c", // Kırmızı-pembe ton
                          }}
                          title="Sınav Günü"
                        ></i>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
