import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBothQuestionsImgThunk,
  answerImgQuestionsThunk,
} from "../../../features/thunks/questionThunk";
import "./bothImgQuestion.css";
import CountdownTimer from "./timer/imgTimer";
import AnswerSummary from "./summary/answerSummary";
import NegativeCanvas from "./x-ray/negative";
import BlackWhiteCanvas from "./x-ray/blackWhite";
import EdgeEnhancementCanvas from "./x-ray/sen";
import BlueFilterCanvas from "./x-ray/os";
import HighIntensityCanvas from "./x-ray/hi";
import TransparencyCanvas from "./x-ray/transparency";
import OrangeFilterCanvas from "./x-ray/o2";

import bw from "../../../assets/x-ray/blackandwhite.png";
import os from "../../../assets/x-ray/os.png";
import hi from "../../../assets/x-ray/hi.png";
import o2 from "../../../assets/x-ray/o2.png";
import sen from "../../../assets/x-ray/sen.png";
import transparency from "../../../assets/x-ray/DARKERLIGHTER.png";
import negative from "../../../assets/x-ray/negative.png";

import FilterButtons from "./imgQuestion/filterButton";
import FullscreenModal from "./imgQuestion/fullScreenModal";
import ImageMarker from "./imgQuestion/imageMarker";
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
  // alignItems: "flex-start",  // ortalamak yerine yukarı hizalama yapalım
  padding: "2rem 1rem", // sağ-sol padding azalttım mobil uyum için
  boxSizing: "border-box",
  background: "white", // Hafif mavi-gri gradient
  overflowY: "auto", // taşarsa kaydırma olsun
};

const contentWrapperStyle = {
  maxWidth: "1600px",
  width: "100%",
  // marginTop: "2rem", // üstte biraz boşluk
  marginBottom: "2rem", // altta biraz boşluk
};
export default function BothImgQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId: examIdParam } = useParams();
  const examId = Number(examIdParam);
  const { bothImgQuestions, duration, name } = useSelector(
    (state) => state.question
  );

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedCoordinates, setSelectedCoordinates] = useState({});
  const [activeFilter, setActiveFilter] = useState("none");
  const [transparencyAlpha, setTransparencyAlpha] = useState(50);
  const [imageSizes, setImageSizes] = useState({});
  const [illegalKeys, setIllegalKeys] = useState([]);
  const [showIllegalModal, setShowIllegalModal] = useState(false);
  const [showSelectAnswerWarning, setShowSelectAnswerWarning] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  /////////////////////////////////////////////////////////////////////////////////
  const [isExamStarted, setIsExamStarted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const examContainerRef = useRef(null);
  const [confirmExitCode, setConfirmExitCode] = useState(null);
  const [userInputCode, setUserInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

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

  const generateRandomCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
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

  const handleStartExam = () => {
    setTimeout(() => {
      requestFullscreen();
    }, 500); // Tam ekran geçişi için kısa bir gecikme ekledim
    dispatch(getBothQuestionsImgThunk(examId));
    setIsExamStarted(true);
  };

  ////////////////////////////////////////////////////////////////////////////////

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const [entryDate, setEntryDate] = useState(null);
  const [entryTime, setEntryTime] = useState(null);

  useEffect(() => {
    const now = new Date();
    setEntryDate(now.toISOString().split("T")[0]); // yyyy-mm-dd
    setEntryTime(now.toTimeString().split(" ")[0]); // HH:MM:SS
  }, []);

  const filters = {
    negative,
    blackwhite: bw,
    edgeenhancement: sen,
    bluefilter: o2,
    highintensity: hi,
    transparency,
    orangefilter: os,
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getBothQuestionsImgThunk(examId));
  }, [dispatch, examId]);
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize edilmiş koordinatlar
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    setSelectedCoordinates((prev) => ({
      ...prev,
      [q.id]: { x: relativeX, y: relativeY },
    }));

    handleAnswerChange(q.id, selectedAnswers[q.id] || null);
  };
  const current =
    bothImgQuestions && bothImgQuestions.length > 0
      ? bothImgQuestions[currentIndex]
      : null;
  const q = current ? current.imgQuestion : null;
  const renderImage = (large = false) => {
    const commonProps = large
      ? {
          style: {
            width: "auto",
            height: "auto",
          },
        }
      : {
          onClick: handleImageClick,
          style: {
            width: "100%",
            height: "auto",
            cursor: "pointer",
            borderRadius: 3,
          },
        };
    switch (activeFilter) {
      case "transparency":
        return (
          <TransparencyCanvas
            src={q.image}
            alphaPercentage={transparencyAlpha}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );
      case "blackwhite":
        return (
          <BlackWhiteCanvas
            src={q.image}
            {...commonProps}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );
      case "negative":
        return (
          <NegativeCanvas
            src={q.image}
            {...commonProps}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );
      case "edgeenhancement":
        return (
          <EdgeEnhancementCanvas
            src={q.image}
            {...commonProps}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );

      case "bluefilter":
        return (
          <BlueFilterCanvas
            src={q.image}
            {...commonProps}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );
      case "highintensity":
        return (
          <HighIntensityCanvas
            src={q.image}
            {...commonProps}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );
      case "orangefilter":
        return (
          <OrangeFilterCanvas
            src={q.image}
            {...commonProps}
            onCanvasLoad={({ width, height }) => {
              setImageSizes((prev) => {
                const prevSize = prev[q.id];
                // Eğer ölçüler zaten aynıysa güncelleme
                if (
                  prevSize &&
                  prevSize.width === width &&
                  prevSize.height === height
                ) {
                  return prev;
                }
                return {
                  ...prev,
                  [q.id]: { width, height },
                };
              });
            }}
          />
        );
      default:
        return (
          <img
            src={q.image}
            alt="Soru görseli"
            crossOrigin="anonymous"
            {...commonProps}
          />
        );
    }
  };
  // renderImage fonksiyonunu burada da tanımlayın (sizin orijinalde renderImage fonksiyonunuz var)
  const renderFilteredImageMemo = useMemo(() => {
    if (!q) return null; // q yoksa render yok
    return renderImage(false);
  }, [activeFilter, transparencyAlpha, q?.image]);
  // Koşullu render
  if (!bothImgQuestions || bothImgQuestions.length === 0) {
    return <div>Yükleniyor veya soru bulunamadı...</div>;
  }

  const handleNext = () => {
    const currentQuestionId = q.id;

    // Eğer kullanıcı cevap vermediyse null olarak işaretle
    if (!selectedAnswers.hasOwnProperty(currentQuestionId)) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionId]: null,
      }));
    }

    if (!selectedCoordinates.hasOwnProperty(currentQuestionId)) {
      setSelectedCoordinates((prev) => ({
        ...prev,
        [currentQuestionId]: null,
      }));
    }

    if (currentIndex < bothImgQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActiveFilter("none");
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [Number(questionId)]: answer }));
  };

  const handleSubmit = () => {
    if (!entryDate || !entryTime) {
      alert(
        "Sınav başlangıç zamanı henüz alınamadı, lütfen sayfayı yenileyip tekrar deneyin."
      );
      return;
    }
    // Eğer kod girişi gösterilmiyorsa, ilk tıklamada kodu oluştur ve göster
    if (!showCodeInput) {
      const code = generateRandomCode();
      setConfirmExitCode(code);
      setShowCodeInput(true);
      // alert kaldırıldı
      return;
    }

    // Eğer kod giriş ekranı açık, girilen kod doğru mu kontrol et
    if (userInputCode.toUpperCase() !== confirmExitCode) {
      alert("Girdiğiniz kod yanlış. Lütfen doğru kodu girin.");
      return;
    }

    const now = new Date();
    const exitDate = now.toISOString().split("T")[0];
    const exitTime = now.toTimeString().split(" ")[0];

    const answersArray = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => {
        const coord = selectedCoordinates[questionId];
        const size = imageSizes[questionId];

        let absoluteCoord = null;
        if (coord && size) {
          absoluteCoord = {
            x: coord.x * size.width,
            y: coord.y * size.height,
          };
        }

        return {
          question_id: Number(questionId),
          answer,
          coordinates: absoluteCoord,
        };
      }
    );

    dispatch(
      answerImgQuestionsThunk({
        answers: answersArray,
        examId,
        entry_date: entryDate,
        entry_time: entryTime,
        exit_date: exitDate,
        exit_time: exitTime,
      })
    );
    navigate("/user-panel");
  };
  // Render filter or plain image

  const handleRemoveCoordinate = () => {
    setSelectedCoordinates((prev) => {
      const updated = { ...prev };
      delete updated[q.id];
      return updated;
    });

    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[q.id];
      return updated;
    });
  };

  return (
    <div>
      {!isExamStarted ? (
        <button
          onClick={handleStartExam}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "24rem",
            margin: "2rem auto",
            padding: "1rem 2.5rem",
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "#fff",
            background: "linear-gradient(45deg, #004aad, #32cd99)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(50, 205, 153, 0.5)",
            transition: "background 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Uygulama Sınavına Başla
        </button>
      ) : (
        <div style={containerStyle} ref={examContainerRef}>
          <div style={contentWrapperStyle}>
            <div className="row justify-content-center">
              {/* Sol: Filtre Butonları */}
              <div className="col-lg-1 mb-4">
                <div className="d-flex flex-column gap-3">
                  <FilterButtons
                    filters={filters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                  <button
                    onClick={openModal}
                    title="Filtreli resmi büyüt"
                    className="btn"
                    style={{
                      backgroundColor: "white",
                      border: "2px solid #001b66", // Eklendi
                      padding: "8px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.3s, border-color 0.3s",
                      fontSize: "1.25rem",
                      color: "#001b66", // İkon rengiyle uyumlu hale getirildi
                    }}
                  >
                    <i
                      className="bi bi-search"
                      style={{ color: "#001b66" }}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Uyarılar */}
              {(showUnansweredWarning ||
                (isPaused && !examEnded) ||
                showFullscreenWarning) && (
                <div style={{ ...overlayStyle, backgroundColor: "white" }}>
                  <div style={alertBoxStyle}>
                    <h4 className="text-warning">
                      <i className="bi bi-exclamation-circle-fill me-2" />
                      Uyarı
                    </h4>
                    <p>
                      {showUnansweredWarning
                        ? `${unansweredCount} tane soruyu boş bıraktınız.`
                        : showFullscreenWarning
                        ? "Tam ekran modundan çıktınız."
                        : "Sınav dışına çıktığınız için duraklatıldı."}
                    </p>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => {
                        if (showUnansweredWarning)
                          setShowUnansweredWarning(false);
                        onConfirmFullscreenWarning();
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
              {/* Sınav güvenliği bileşeni */}
              <ExamSecurityHandler
                onIllegalAction={(key) => {
                  setIllegalKeys((prev) => [...prev, key]);
                  setShowIllegalModal(true);
                }}
              />
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

              {/* Orta: Resim ve Şıklar */}
              <div className="col-lg-7 mb-4">
                <div className="card shadow rounded-4 p-4 position-relative">
                  {/* Başlık */}
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <div className="fw-bold fs-5 text-dark d-flex align-items-center gap-2">
                      <i className="bi bi-journal-text text-primary"></i>
                      {name}
                    </div>
                    <h5 className="mb-0 text-primary d-flex align-items-center gap-2">
                      <i className="bi bi-question-circle"></i>
                      Soru {currentIndex + 1} / {bothImgQuestions.length}
                    </h5>
                  </div>

                  {/* ImageMarker */}
                  {!examEnded && q?.image && (
                    <div className="text-center mb-4">
                      <ImageMarker
                        src={q.image}
                        selectedCoordinate={selectedCoordinates[q.id]}
                        onImageClick={(coord) => {
                          if (!selectedAnswers[q.id]) {
                            setShowSelectAnswerWarning(true);
                            return;
                          }
                          setSelectedCoordinates((prev) => ({
                            ...prev,
                            [q.id]: coord,
                          }));
                          handleAnswerChange(
                            q.id,
                            selectedAnswers[q.id] || null
                          );
                        }}
                        onImageLoad={({ width, height }) => {
                          setImageSizes((prev) => {
                            const prevSize = prev[q.id];
                            if (
                              prevSize?.width === width &&
                              prevSize?.height === height
                            ) {
                              return prev;
                            }
                            return {
                              ...prev,
                              [q.id]: { width, height },
                            };
                          });
                        }}
                        activeFilter={activeFilter}
                        transparencyAlpha={transparencyAlpha}
                        renderFilteredImage={renderFilteredImageMemo}
                      >
                        {activeFilter === "transparency" && (
                          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                            <button
                              onClick={() =>
                                setTransparencyAlpha((p) => Math.max(0, p - 10))
                              }
                              className="btn btn-outline-secondary btn-sm"
                            >
                              -
                            </button>
                            <span>{transparencyAlpha}%</span>
                            <button
                              onClick={() =>
                                setTransparencyAlpha((p) =>
                                  Math.min(100, p + 10)
                                )
                              }
                              className="btn btn-outline-secondary btn-sm"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </ImageMarker>
                      {showSelectAnswerWarning && (
                        <div style={overlayStyle}>
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "2rem",
                              borderRadius: "10px",
                              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                              textAlign: "center",
                              maxWidth: "500px",
                              marginRight: "650px",
                              marginBottom: "200px",
                            }}
                          >
                            <h4 className="text-warning">
                              <i className="bi bi-exclamation-circle-fill me-2" />
                              Uyarı
                            </h4>
                            <p>Lütfen önce bir cevap seçiniz.</p>
                            <button
                              className="btn btn-primary mt-3"
                              onClick={() => setShowSelectAnswerWarning(false)}
                            >
                              Tamam
                            </button>
                          </div>
                        </div>
                      )}
                      {modalOpen && (
                        <FullscreenModal onClose={closeModal}>
                          {renderImage(true)}
                        </FullscreenModal>
                      )}

                      {selectedCoordinates[q.id] && (
                        <div className="text-center mt-3">
                          <button
                            onClick={handleRemoveCoordinate}
                            className="btn btn-danger"
                          >
                            <i className="bi bi-trash3-fill me-2"></i>
                            İşareti Sil
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Soru Metni */}
                  <h5
                    className="mb-4 p-3 border rounded bg-white"
                    dangerouslySetInnerHTML={{ __html: q?.question }}
                  ></h5>

                  {/* Şıklar Grid Şeklinde */}
                  <div className="row g-2">
                    {["a", "b", "c", "d", "e", "f"]
                      .map((opt) => ({ key: opt, text: q?.[opt] }))
                      .filter(({ text }) => text != null)
                      .map(({ key, text }) => {
                        const isSelected = selectedAnswers[q.id] === key;
                        return (
                          <div className="col-12 col-md-6 col-lg-4" key={key}>
                            <button
                              onClick={() =>
                                handleAnswerChange(Number(q.id), key)
                              }
                              className="list-group-item list-group-item-action d-flex align-items-center w-100"
                              style={{
                                borderRadius: "10px",
                                border: isSelected
                                  ? "2px solid #001b66"
                                  : "1.5px solid #ced4da",
                                backgroundColor: isSelected
                                  ? "#001b66"
                                  : "#ffffff",
                                color: isSelected ? "#ffffff" : "#001b66",
                                fontWeight: 700,
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                padding: "10px 15px", // padding eklendi
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor =
                                    "#e6ecf5";
                                  e.currentTarget.style.borderColor = "#001b66";
                                  e.currentTarget.style.color = "#001b66";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor =
                                    "#ffffff";
                                  e.currentTarget.style.borderColor = "#ced4da";
                                  e.currentTarget.style.color = "#001b66";
                                }
                              }}
                            >
                              <span className="me-2 fw-bold text-uppercase">
                                {key}:
                              </span>
                              {text}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  {/* Navigasyon */}
                  <div
                    className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mt-3"
                    style={{ backgroundColor: "white" }}
                  >
                    {" "}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleNext}
                        disabled={currentIndex === 0}
                      >
                        <i className="bi bi-arrow-left-circle me-1" />
                        Önceki
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleNext}
                        disabled={currentIndex === bothImgQuestions.length - 1}
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
              {/* Sağ: Sayaç ve Cevap Özeti */}
              <div className="col-lg-2 mb-4 d-flex flex-column align-items-stretch gap-3">
                {/* Timer Kart dışında, ortalanmış */}
                <div
                  className="d-flex justify-content-center align-items-center mb-3"
                  style={{ minHeight: "100px" }}
                >
                  <CountdownTimer
                    duration={duration}
                    onTimeUp={() => {
                      if (currentIndex < bothImgQuestions.length - 1) {
                        handleNext();
                      } else {
                        handleSubmit();
                      }
                    }}
                    resetKey={currentIndex}
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
                    answers={bothImgQuestions.map(
                      (q) => selectedAnswers[q.imgQuestion.id] || "-"
                    )}
                    total={bothImgQuestions.length}
                    onSelectQuestion={(index) => setCurrentIndex(index)}
                    currentIndex={currentIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
