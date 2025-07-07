import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionsPracticeExamThunk } from "../../../features/thunks/practiceExamThunk";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./imgQuestion.css";
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
  marginBottom: "2rem", // altta biraz boşluk
};

export default function PracticeQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId: examIdParam } = useParams();
  const examId = Number(examIdParam);
  const { imgQuestions, duration } = useSelector((state) => state.practiceExam);
  console.log("imgQuestions:", imgQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedCoordinates, setSelectedCoordinates] = useState({});
  const [activeFilter, setActiveFilter] = useState("none");
  const [transparencyAlpha, setTransparencyAlpha] = useState(50);
  const [imageSizes, setImageSizes] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentAnswerResult, setCurrentAnswerResult] = useState(null);

  const [answerResults, setAnswerResults] = useState(() => {
    const initialResults = {};
    imgQuestions.forEach((q) => {
      const id = q.poolImgQuestion.id;
      initialResults[id] = null;
    });
    return initialResults;
  });
  useEffect(() => {
    if (imgQuestions.length > 0) {
      const initialResults = {};
      imgQuestions.forEach((q) => {
        const id = q.poolImgQuestion.id;
        initialResults[id] = null;
      });
      setAnswerResults(initialResults);
    }
  }, [imgQuestions]);

  const [modalOpen, setModalOpen] = useState(false);

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
    dispatch(getQuestionsPracticeExamThunk(examId));
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
    imgQuestions && imgQuestions.length > 0 ? imgQuestions[currentIndex] : null;
  const q = current ? current.poolImgQuestion : null;
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
  };
  // renderImage fonksiyonunu burada da tanımlayın (sizin orijinalde renderImage fonksiyonunuz var)
  const renderFilteredImageMemo = useMemo(() => {
    if (!q) return null; // q yoksa render yok
    return renderImage(false);
  }, [activeFilter, transparencyAlpha, q?.image]);

  // Koşullu render
  if (!imgQuestions || imgQuestions.length === 0) {
    return <div>Yükleniyor veya soru bulunamadı...</div>;
  }

  const pointInPolygon = (point, polygon) => {
    let { x, y } = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  };

  const handleNext = () => {
    const currentQuestion = imgQuestions[currentIndex];
    const q = currentQuestion.poolImgQuestion;
    const currentQuestionId = q.id;
    const selectedAnswer = selectedAnswers[currentQuestionId];
    const correctAnswer = q.answer;
    const selectedCoord = selectedCoordinates[currentQuestionId];
    const imgSize = imageSizes[currentQuestionId];

    let isInside = false;

    if (selectedCoord && imgSize && q.coordinate) {
      const absoluteX = selectedCoord.x * imgSize.width;
      const absoluteY = selectedCoord.y * imgSize.height;

      for (const poly of q.coordinate) {
        if (
          poly.length >= 3 &&
          pointInPolygon({ x: absoluteX, y: absoluteY }, poly)
        ) {
          isInside = true;
          break;
        }
      }
    }

    const isCorrect = selectedAnswer === correctAnswer && isInside;

    setAnswerResults((prev) => ({
      ...prev,
      [currentQuestionId]: isCorrect,
    }));

    // Burada sonucu set ediyoruz ve modal açılıyor:
    setCurrentAnswerResult(isCorrect);
    setShowResultModal(true);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    // Modal kapandığında soruyu ilerlet:
    if (currentIndex < imgQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setActiveFilter("none");
    } else {
      // Son soru ise sınav bitirilebilir (istersen burada yönlendirme yapabilirsin)
      navigate("/user-panel");
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [Number(questionId)]: answer }));
  };

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
  const questionId = q?.id;
  return (
    <div style={containerStyle}>
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
                <i className="bi bi-search" style={{ color: "#001b66" }}></i>
              </button>
            </div>
          </div>

          {/* Orta: Resim ve Şıklar */}
          <div className="col-lg-7 mb-4">
            <div className="card shadow rounded-4 p-4 position-relative">
              {/* Başlık */}
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 className="mb-0 text-primary d-flex align-items-center gap-2">
                  <i className="bi bi-question-circle"></i>
                  Soru {currentIndex + 1} / {imgQuestions.length}
                </h5>
                {/* Cevap sonucu gösterimi */}

                {q?.id !== undefined && (
                  <div>
                    {answerResults[q.id] === null && (
                      <span style={{ color: "orange" }}>
                        ⚠️ Cevap verilmedi
                      </span>
                    )}
                    {answerResults[q.id] === true && (
                      <span style={{ color: "green" }}>✔️ Doğru</span>
                    )}
                    {answerResults[q.id] === false && (
                      <span style={{ color: "red" }}>❌ Yanlış</span>
                    )}
                  </div>
                )}
              </div>

              {/* ImageMarker */}
              {q?.image && (
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
                      handleAnswerChange(q.id, selectedAnswers[q.id] || null);
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
                            setTransparencyAlpha((p) => Math.min(100, p + 10))
                          }
                          className="btn btn-outline-secondary btn-sm"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </ImageMarker>

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
                          onClick={() => handleAnswerChange(Number(q.id), key)}
                          className="list-group-item list-group-item-action d-flex align-items-center w-100"
                          style={{
                            borderRadius: "10px",
                            border: isSelected
                              ? "2px solid #001b66"
                              : "1.5px solid #ced4da",
                            backgroundColor: isSelected ? "#001b66" : "#ffffff",
                            color: isSelected ? "#ffffff" : "#001b66",
                            fontWeight: 700,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            padding: "10px 15px", // padding eklendi
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "#e6ecf5";
                              e.currentTarget.style.borderColor = "#001b66";
                              e.currentTarget.style.color = "#001b66";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "#ffffff";
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
                    disabled={currentIndex === imgQuestions.length - 1}
                  >
                    Sonraki
                    <i className="bi bi-arrow-right-circle ms-1" />
                  </button>
                </div>
                {/* Sınavı Bitir */}
                <button
                  className="btn btn-outline-primary"
                  onClick={handleNext}
                >
                  Cevabı Kontrol Et
                </button>
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
                  if (currentIndex < imgQuestions.length - 1) {
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
                answers={imgQuestions.map(
                  (q) => selectedAnswers[q.poolImgQuestion.id] || "-"
                )}
                total={imgQuestions.length}
                onSelectQuestion={(index) => setCurrentIndex(index)}
                currentIndex={currentIndex}
              />
            </div>
          </div>
        </div>
        {showResultModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1050,
            }}
            onClick={closeResultModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "10px",
                minWidth: "300px",
                textAlign: "center",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              <h4>{currentAnswerResult ? "✔️ Doğru!" : "❌ Yanlış!"}</h4>
              <button
                onClick={closeResultModal}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.5rem",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#001b66",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Devam Et
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
