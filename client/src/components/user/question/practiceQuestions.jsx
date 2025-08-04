import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
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
import ResultModal from "./resultModal";

// Style objeleri dışarıda tanımlanmalı, bu doğru bir yaklaşım
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
  padding: "2rem 0 0",
  boxSizing: "border-box",
  background: "white",
  overflowY: "auto",
};

const contentWrapperStyle = {
  maxWidth: "1600px",
  width: "100%",
  marginBottom: "2rem",
};

// Bu yardımcı fonksiyonu bileşenin dışında tanımlamak daha iyi bir yaklaşımdır
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

export default function PracticeQuestion() {
  // 1. Dış Hook'lar (Redux, Router vb.)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId: examIdParam } = useParams();
  const examId = Number(examIdParam);
  const { imgQuestions, duration } = useSelector((state) => state.practiceExam);

  // 2. Durum Yönetimi Hook'ları (useState)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedCoordinates, setSelectedCoordinates] = useState({});
  const [activeFilter, setActiveFilter] = useState("none");
  const [transparencyAlpha, setTransparencyAlpha] = useState(50);
  const [imageSizes, setImageSizes] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentAnswerResult, setCurrentAnswerResult] = useState(null);
  const [answerResults, setAnswerResults] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(null);
  const [entryTime, setEntryTime] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSelectAnswerWarning, setShowSelectAnswerWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // 3. Referans Hook'ları (useRef) - En güvenli çözüm için bu referans eklendi
  const timeUpHandledRef = useRef(false);

  // 4. Yardımcı Değişkenler ve `useMemo` ile Türetilmiş Değerler
  const TABLET_BREAKPOINT = 768;
  const DESKTOP_BREAKPOINT = 1400;

  const filters = useMemo(
    () => ({
      negative,
      blackwhite: bw,
      edgeenhancement: sen,
      bluefilter: o2,
      orangefilter: os,
      highintensity: hi,
      transparency,
    }),
    []
  );

  const current = useMemo(() => {
    return imgQuestions && imgQuestions.length > 0
      ? imgQuestions[currentIndex]
      : null;
  }, [imgQuestions, currentIndex]);

  const q = useMemo(() => {
    return current ? current.poolImgQuestion : null;
  }, [current]);

  const questionId = useMemo(() => q?.id, [q]);

  // 5. Efekt Hook'ları (useEffect)
  useEffect(() => {
    dispatch(getQuestionsPracticeExamThunk(examId));
    const now = new Date();
    setEntryDate(now.toISOString().split("T")[0]);
    setEntryTime(now.toTimeString().split(" ")[0]);
  }, [dispatch, examId]);

  useEffect(() => {
    if (imgQuestions.length > 0 && Object.keys(answerResults).length === 0) {
      const initialResults = {};
      imgQuestions.forEach((item) => {
        initialResults[item.poolImgQuestion.id] = null;
      });
      setAnswerResults(initialResults);
    }
  }, [imgQuestions]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < TABLET_BREAKPOINT);
      setIsTablet(width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 6. Geri Çağırım Fonksiyonları (useCallback)
  const evaluateAndShowResult = useCallback(() => {
    // Fonksiyon zaten çalışıyorsa veya soru yoksa hemen çık
    if (isEvaluating || !q) return;

    setIsEvaluating(true);

    const currentQuestionId = q.id;
    const selectedAnswer = selectedAnswers[currentQuestionId];
    const correctAnswer = q.answer;
    const selectedCoord = selectedCoordinates[currentQuestionId];
    const imgSize = imageSizes[currentQuestionId];
    const correctArea = q.correctArea;

    let isInside = false;
    if (selectedCoord && correctArea && imgSize) {
      const scaledCoord = {
        x: (selectedCoord.x / imgSize.width) * 100,
        y: (selectedCoord.y / imgSize.height) * 100,
      };
      isInside = pointInPolygon(scaledCoord, correctArea);
    }

    setShowResultModal(true);
    // Modal gösterildiğinde isEvaluating'i false yap ki, diğer olaylar çalışabilsin
    setIsEvaluating(false);
  }, [q, isEvaluating, selectedAnswers, selectedCoordinates, imageSizes]);

  const handleTimeUp = useCallback(() => {
    // Süre bitme olayı zaten işlenmişse fonksiyonu tekrar çalıştırma
    if (timeUpHandledRef.current) {
      return;
    }
    timeUpHandledRef.current = true; // Olayın işlendiğini işaretle

    if (isEvaluating) return;
    setIsEvaluating(true);
    evaluateAndShowResult();
  }, [isEvaluating, evaluateAndShowResult]);

  const closeResultModal = useCallback(() => {
    setShowResultModal(false);
    setIsEvaluating(false);
    timeUpHandledRef.current = false; // Bir sonraki soruya geçmeden önce ref'i sıfırla

    if (currentIndex === imgQuestions.length - 1) {
      navigate("/practice-exams");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setActiveFilter("none");
    }
  }, [currentIndex, imgQuestions, navigate]);

  const handleNextQuestion = useCallback(() => {
    if (isEvaluating || showResultModal) {
      return;
    }
    evaluateAndShowResult();
  }, [isEvaluating, showResultModal, evaluateAndShowResult]);

  const handleFinishExam = useCallback(() => {
    navigate("/practice-exams");
  }, [navigate]);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleAnswerChange = useCallback((questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [Number(questionId)]: answer }));
  }, []);

  const handleRemoveCoordinate = useCallback(() => {
    setSelectedCoordinates((prev) => {
      const updated = { ...prev };
      if (q && q.id) {
        delete updated[q.id];
      }
      return updated;
    });
  }, [q]);

  const renderImage = useCallback(
    (large = false) => {
      if (!q) return null;
      const commonProps = large
        ? { style: { width: "auto", height: "auto" } }
        : {
            onClick: () => {},
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
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              alphaPercentage={transparencyAlpha}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => {
                  const prevSize = prev[q.id];
                  if (
                    prevSize &&
                    prevSize.width === width &&
                    prevSize.height === height
                  ) {
                    return prev;
                  }
                  return { ...prev, [q.id]: { width, height } };
                });
              }}
            />
          );
        // ... (Diğer case'ler benzer şekilde devam eder)
        case "blackwhite":
          return (
            <BlackWhiteCanvas
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              {...commonProps}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => ({
                  ...prev,
                  [q.id]: { width, height },
                }));
              }}
            />
          );
        case "negative":
          return (
            <NegativeCanvas
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              {...commonProps}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => ({
                  ...prev,
                  [q.id]: { width, height },
                }));
              }}
            />
          );
        case "edgeenhancement":
          return (
            <EdgeEnhancementCanvas
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              {...commonProps}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => ({
                  ...prev,
                  [q.id]: { width, height },
                }));
              }}
            />
          );
        case "bluefilter":
          return (
            <BlueFilterCanvas
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              {...commonProps}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => ({
                  ...prev,
                  [q.id]: { width, height },
                }));
              }}
            />
          );
        case "orangefilter":
          return (
            <OrangeFilterCanvas
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              {...commonProps}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => ({
                  ...prev,
                  [q.id]: { width, height },
                }));
              }}
            />
          );
        case "highintensity":
          return (
            <HighIntensityCanvas
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              {...commonProps}
              onCanvasLoad={({ width, height }) => {
                setImageSizes((prev) => ({
                  ...prev,
                  [q.id]: { width, height },
                }));
              }}
            />
          );
        default:
          return (
            <img
              key={`${q.id}-${activeFilter}`}
              src={q.image}
              alt="Soru görseli"
              crossOrigin="anonymous"
              {...commonProps}
            />
          );
      }
    },
    [activeFilter, transparencyAlpha, q, setImageSizes]
  );

  const renderFilteredImageMemo = useMemo(() => {
    if (!q) return null;
    return renderImage(false);
  }, [renderImage, q]);

  // Hook'ların tamamı bittikten sonra, erken dönüş koşulu
  if (!imgQuestions || imgQuestions.length === 0) {
    return <div>Yükleniyor veya soru bulunamadı...</div>;
  }
  console.log(imgQuestions);

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <div className="row justify-content-center">
          {/* Sol: Filtre Butonları */}
          <div className="col-12 col-lg-1 mb-3 mb-lg-0 filter-column">
            <div className="d-none d-lg-flex flex-column gap-3 align-items-center">
              <FilterButtons
                filters={filters}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
              {activeFilter === "transparency" && (
                <div className="d-flex justify-content-center align-items-center gap-3">
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
              <button
                onClick={openModal}
                title="Filtreli resmi büyüt"
                className="btn"
                style={{
                  backgroundColor: "white",
                  border: "2px solid #001b66",
                  padding: "8px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s, border-color 0.3s",
                  fontSize: "1.25rem",
                  color: "#001b66",
                  width: isMobile ? 36 : 100,
                  height: isMobile ? 24 : 80,
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
                      setShowSelectAnswerWarning(false); // Başarılı işaretleme sonrası uyarıyı kapat
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

                  {/* Koşullu uyarı bileşenin içinde ve render döngüsünde */}
                  {showSelectAnswerWarning && (
                    <div className="alert alert-warning mt-3" role="alert">
                      Önce şıklardan birini seçmelisiniz.
                    </div>
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
                className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3"
                style={{ backgroundColor: "white" }}
              >
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                    disabled={currentIndex === imgQuestions.length - 1}
                  >
                    Sonraki Soru
                    <i className="bi bi-arrow-right-circle ms-1" />
                  </button>
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Sınavı bitirmek istediğinizden emin misiniz?"
                        )
                      ) {
                        handleFinishExam();
                      }
                    }}
                  >
                    Sınavı Bitir
                    <i className="bi bi-x-circle ms-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: Sayaç ve Cevap Özeti */}
          <div className="col-lg-2 mb-4 d-flex flex-column align-items-stretch gap-3">
            <div
              className="d-flex justify-content-center align-items-center mb-3"
              style={{ minHeight: "100px" }}
            >
              <CountdownTimer
                duration={duration}
                onTimeUp={handleTimeUp}
                // currentIndex'i bir key olarak kullanmak, bileşen her soru değiştiğinde tamamen yeniden oluşturulmasını sağlar.
                // Bu, zamanlayıcının da sıfırlanmasını garanti eder.
                key={currentIndex}
              />
            </div>

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
          <ResultModal
            question={q}
            selectedAnswer={selectedAnswers[q.id]}
            selectedCoordinate={selectedCoordinates[q.id]}
            imageSize={imageSizes[q.id]}
            onClose={closeResultModal}
            // isLastQuestion prop'unu ekleyerek modal içindeki butonu dinamik hale getirebilirsiniz.
            isLastQuestion={currentIndex === imgQuestions.length - 1}
            polygonArea={q.coordinate?.[0] || []} // 👈 sadece polygonu al
          />
        )}
        {modalOpen && (
          <FullscreenModal onClose={closeModal}>
            {renderImage(true)}
          </FullscreenModal>
        )}
      </div>
    </div>
  );
}
