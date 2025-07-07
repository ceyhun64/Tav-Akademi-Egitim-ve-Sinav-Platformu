import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTeoQuestionsThunk,
  answerTeoQuestionsThunk,
} from "../../../features/thunks/questionThunk";
import CountdownTimer from "./timer/teoTimer";
import AnswerSummary from "./summary/answerSummary";
// import "./TeoQuestion.css";
import ExamSecurityHandler from "./examSecurity";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const alertBoxStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  maxWidth: "500px",
};

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
  boxSizing: "border-box",
  backgroundImage: "linear-gradient(to right, #f0f4f8, #e0e7ee)",
};

const contentWrapperStyle = {
  maxWidth: "1200px",
  width: "100%",
};

export default function TeoQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId: examIdParam } = useParams();
  const examId = Number(examIdParam);
  const { teoQuestions, duration, name } = useSelector(
    (state) => state.question
  );
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entryDate, setEntryDate] = useState(null);
  const [entryTime, setEntryTime] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const examContainerRef = useRef(null);
  const [confirmExitCode, setConfirmExitCode] = useState(null);
  const [userInputCode, setUserInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  const [illegalKeys, setIllegalKeys] = useState([]);
  const [showIllegalModal, setShowIllegalModal] = useState(false);

  // TAM EKRAN MODUNA GEÇİŞ FONKSİYONU
  const requestFullscreen = () => {
    const elem = examContainerRef.current;
    if (!elem) return;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      requestFullscreen();
    }, 500);

    return () => clearTimeout(timer);
  }, [examEnded]);

  // TAM EKRANDAN ÇIKIŞTA UYARI VER
  useEffect(() => {
    let initialCheckDone = false;

    const handleFullscreenChange = () => {
      if (!initialCheckDone) {
        initialCheckDone = true;
        return;
      }

      const isFullScreen =
        document.fullscreenElement === examContainerRef.current ||
        document.webkitFullscreenElement === examContainerRef.current ||
        document.mozFullScreenElement === examContainerRef.current ||
        document.msFullscreenElement === examContainerRef.current;

      if (!isFullScreen && !examEnded) {
        setIsPaused(true);
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Tam ekran isteğini biraz geciktir
    const timer = setTimeout(() => {
      requestFullscreen();
    }, 500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [examEnded]);

  // TARAYICI GERİ BUTONU TETİKLENDİĞİNDE UYARI
  useEffect(() => {
    const handlePopState = (e) => {
      // Geri gitmeye çalışınca sınavı duraklat ve uyarı göster
      setIsPaused(true);
      setShowFullscreenWarning(true);

      // History'yi ileri alarak geri gitmeyi engelleelim
      window.history.pushState(null, null, window.location.href);
    };

    // Sayfa açılırken bir state push et (geri tuşunu yakalamak için)
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Klavye kısayolları (örn. ESC) ile tam ekran çıkışına müdahale
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC veya F11 engelle (tam ekran çıkışını önlemek için)
      if ((e.key === "Escape" || e.key === "F11") && !examEnded) {
        e.preventDefault();
        setIsPaused(true);
        setShowFullscreenWarning(true);
        requestFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [examEnded]);

  // İlk giriş zamanı
  useEffect(() => {
    const now = new Date();
    setEntryDate(now.toISOString().split("T")[0]);
    setEntryTime(now.toTimeString().split(" ")[0]);
  }, []);

  useEffect(() => {
    dispatch(getTeoQuestionsThunk(examId));
  }, [dispatch, examId]);

  // Sekmeden çıkınca süreyi duraklat (Ekstra güvenlik)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examEnded) {
        setIsPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examEnded]);

  if (!teoQuestions || teoQuestions.length === 0) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Yükleniyor veya soru bulunamadı...</p>
      </div>
    );
  }

  const current = teoQuestions[currentIndex];
  const q = current.teoQuestion;

  const handleNext = () => {
    if (currentIndex < teoQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [Number(questionId)]: answer,
    }));
  };
  const generateRandomCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = (autoSubmit = false) => {
    if (!entryDate || !entryTime) {
      alert(
        "Sınav başlangıç zamanı henüz alınamadı, lütfen sayfayı yenileyip tekrar deneyin."
      );
      return;
    }

    const totalQuestionCount = teoQuestions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    const unanswered = totalQuestionCount - answeredCount;

    if (!autoSubmit) {
      // Kullanıcı manuel bitirirken tüm soruları cevaplamasını zorunlu kıl
      if (unanswered > 0) {
        setUnansweredCount(unanswered);
        setShowUnansweredWarning(true);
        setIsPaused(true); // Sınavı durdur
        return;
      }

      // Eğer kod girişi gösterilmiyorsa, ilk tıklamada kodu oluştur ve göster
      if (!showCodeInput) {
        const code = generateRandomCode();
        setConfirmExitCode(code);
        setShowCodeInput(true);
        return;
      }

      // Eğer kod giriş ekranı açık, girilen kod doğru mu kontrol et
      if (userInputCode.toUpperCase() !== confirmExitCode) {
        alert("Girdiğiniz kod yanlış. Lütfen doğru kodu girin.");
        return;
      }
    }

    // Otomatik bitir veya doğrulama geçtiyse sınavı bitir
    const now = new Date();
    const exitDate = now.toISOString().split("T")[0];
    const exitTime = now.toTimeString().split(" ")[0];

    const answersArray = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        question_id: Number(questionId),
        answer,
      })
    );

    setExamEnded(true);
    setIsPaused(true);

    dispatch(
      answerTeoQuestionsThunk({
        answers: answersArray,
        examId,
        entry_date: entryDate,
        entry_time: entryTime,
        exit_date: exitDate,
        exit_time: exitTime,
      })
    );

    // Yönlendirme
    navigate("/user-panel");
  };

  const handleSelectQuestion = (index) => {
    setCurrentIndex(index);
  };
  // Tam ekran uyarısında "Tamam" tıklanınca devam et ve tekrar tam ekran moduna al
  const onConfirmFullscreenWarning = () => {
    setShowFullscreenWarning(false);
    setIsPaused(false);
    requestFullscreen();
  };

  return (
    <div style={containerStyle} ref={examContainerRef}>
      <div style={contentWrapperStyle}>
        {/* Sınav Güvenliği */}
        <ExamSecurityHandler
          onIllegalAction={(key) => {
            setIllegalKeys((prev) => [...prev, key]);
            setShowIllegalModal(true);
          }}
        />

        {/* Yasaklı İşlem Modalı */}
        {showIllegalModal && (
          <div style={overlayStyle}>
            <div style={alertBoxStyle}>
              <h4 className="text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2" />
                İllegal Hareket Gözetmene Bildirildi
              </h4>
              <p>
                Aşağıdaki tuşlara bastığınız algılandı ve bu işlem sınav
                kurallarına aykırıdır:
              </p>
              <ul style={{ textAlign: "left" }}>
                {illegalKeys.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
              <button
                className="btn btn-primary mt-3"
                onClick={() => setShowIllegalModal(false)}
              >
                Tamam
              </button>
            </div>
          </div>
        )}

        {/* Uyarı: Cevapsız Sorular */}
        {showUnansweredWarning && (
          <div style={{ ...overlayStyle, backgroundColor: "white" }}>
            <div style={alertBoxStyle}>
              <h4 className="text-warning">
                <i className="bi bi-exclamation-circle-fill me-2" />
                Uyarı
              </h4>
              <p>{unansweredCount} tane soruyu boş bıraktınız.</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => {
                  setShowUnansweredWarning(false);
                  setIsPaused(false);
                }}
              >
                Tamam
              </button>
            </div>
          </div>
        )}

        {/* Sınav Sonlandı */}
        {examEnded && (
          <div style={overlayStyle}>
            <div style={alertBoxStyle}>
              <h4 className="text-success">
                <i className="bi bi-flag-fill me-2" />
                Sınav Sonlandı
              </h4>
              <p>Süreniz doldu, sınav otomatik olarak bitirildi.</p>
              <button
                className="btn btn-success mt-3"
                onClick={() => navigate("/user-panel")}
              >
                Anasayfaya Dön
              </button>
            </div>
          </div>
        )}

        {/* Duraklatıldı / Uyarı */}
        {((isPaused && !showUnansweredWarning) || showFullscreenWarning) &&
        !examEnded ? (
          <div style={overlayStyle}>
            <div style={alertBoxStyle}>
              <h4 className="text-info">
                <i className="bi bi-pause-circle-fill me-2" />
                {showFullscreenWarning ? "Uyarı" : "Sınav duraklatıldı"}
              </h4>
              <p>
                {showFullscreenWarning
                  ? "Tam ekran modundan çıktınız. Devam etmek için Tamam'a tıklayın."
                  : "Sınav dışına çıktığınız için duraklatıldı."}
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={onConfirmFullscreenWarning}
              >
                Tamam
              </button>
            </div>
          </div>
        ) : (
          !examEnded && (
            <div className="row">
              {/* Soru Kartı */}
              <div className="col-lg-9 mb-4 shadow-sm border-0">
                <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                  <div
                    className="card-header bg-white d-flex justify-content-between align-items-center border-bottom"
                    style={{ backgroundColor: "#f4f6fc" }}
                  >
                    <div className="fw-bold fs-5 text-dark d-flex align-items-center gap-2">
                      <i className="bi bi-journal-text text-primary" />
                      {name}
                    </div>
                    <h5 className="mb-0 text-primary d-flex align-items-center gap-2">
                      <i className="bi bi-question-circle" />
                      Soru {currentIndex + 1} / {teoQuestions.length}
                    </h5>
                  </div>

                  <div className="card-body">
                    {q?.image && (
                      <div className="mb-4 text-center">
                        <img
                          src={q.image}
                          alt="Soru görseli"
                          className="img-fluid rounded border"
                          style={{
                            maxHeight: "300px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                    <h5
                      className="mb-4 p-3 border rounded"
                      style={{ backgroundColor: "#e6e9f7", color: "#001b66" }}
                      dangerouslySetInnerHTML={{ __html: q?.question }}
                    ></h5>

                    <div className="list-group">
                      {["a", "b", "c", "d", "e"]
                        .map((opt) => ({ key: opt, text: q?.[opt] }))
                        .filter(({ text }) => text != null)
                        .map(({ key, text }) => {
                          const isSelected = selectedAnswers[q.id] === key;
                          return (
                            <button
                              key={key}
                              className={`list-group-item list-group-item-action d-flex align-items-center ${
                                isSelected ? "active border border-primary" : ""
                              }`}
                              onClick={() =>
                                handleAnswerChange(Number(q.id), key)
                              }
                            >
                              <span className="me-2 fw-bold text-uppercase">
                                {key}:
                              </span>
                              {text}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Navigasyon ve Kod */}
                  <div className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 bg-light border-top">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                      >
                        <i className="bi bi-arrow-left-circle me-1" />
                        Önceki
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleNext}
                        disabled={currentIndex === teoQuestions.length - 1}
                      >
                        Sonraki
                        <i className="bi bi-arrow-right-circle ms-1" />
                      </button>
                    </div>

                    {/* Kod Giriş Alanı */}
                    {showCodeInput && (
                      <div
                        className="mb-3 flex-grow-1"
                        style={{ minWidth: "300px" }}
                      >
                        <label htmlFor="exitCode" className="form-label">
                          <i className="bi bi-shield-lock me-2 text-primary" />
                          Lütfen aşağıdaki kodu giriniz:
                        </label>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            backgroundColor: "#c9d1f4",
                            padding: "10px",
                            marginBottom: "10px",
                            userSelect: "all",
                            letterSpacing: "4px",
                            textAlign: "center",
                            borderRadius: "6px",
                            color: "#001b66",
                          }}
                        >
                          {confirmExitCode}
                        </div>
                        <input
                          id="exitCode"
                          type="text"
                          className="form-control"
                          value={userInputCode}
                          onChange={(e) =>
                            setUserInputCode(e.target.value.toUpperCase())
                          }
                          maxLength={confirmExitCode?.length || 6}
                          autoFocus
                        />
                      </div>
                    )}

                    {/* Sınavı Bitir */}
                    {!examEnded && (
                      <button
                        className="btn btn-success mt-3 mt-md-0"
                        onClick={() => handleSubmit(false)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <i className="bi bi-check2-circle me-2" />
                        Sınavı Bitir
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cevap Özeti */}
              <div className="col-lg-3 position-relative">
                {/* Zamanlayıcı - Sağ üst sabit */}
                <div
                  style={{
                    top: "30px",
                    right: "10px",
                  }}
                >
                  <CountdownTimer
                    duration={duration}
                    isPaused={isPaused || examEnded}
                    onTimeUp={() => handleSubmit(true)}
                  />
                </div>

                {/* Cevap Özeti Kartı */}
                <div
                  className="card shadow-sm rounded-4 p-3 d-flex flex-column align-items-center"
                  style={{
                    maxHeight: "2000px",
                    overflowY: "auto",
                    height: "360px",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-list-check"></i>
                    <span className="fw-bold">Cevap Özeti</span>
                  </div>
                  <AnswerSummary
                    answers={teoQuestions.map(
                      (q) => selectedAnswers[q.teoQuestion.id] || "-"
                    )}
                    total={teoQuestions.length}
                    onSelectQuestion={(index) => setCurrentIndex(index)}
                    currentIndex={currentIndex}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
