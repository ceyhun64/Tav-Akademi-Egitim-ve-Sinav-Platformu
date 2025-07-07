import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  updatePoolImgThunk,
  getPoolImgByIdThunk,
} from "../../../features/thunks/poolImgThunk";
import QuestionEditor from "./questionEditor";
import PolygonEditor from "./polygonEditor";
import {
  getDifLevelsThunk,
  getQuestionCatThunk,
} from "../../../features/thunks/queDifThunk";
import Sidebar from "../adminPanel/sidebar";

import { getImgBookletsThunk } from "../../../features/thunks/bookletThunk";

export default function UpdatePoolImg() {
  const { id } = useParams();
  const { poolImg } = useSelector((state) => state.poolImg);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getPoolImgByIdThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (poolImg) {
      setForm({
        question: poolImg.question,
        a: poolImg.a,
        b: poolImg.b,
        c: poolImg.c,
        d: poolImg.d,
        e: poolImg.e,
        f: poolImg.f,
        answer: poolImg.answer,
        bookletId: poolImg.bookletId.toString(),
        difLevelId: poolImg.difLevelId.toString(),
        questionCategoryId: poolImg.questionCategoryId.toString(),
      });

      let coords = [];
      if (typeof poolImg.coordinate === "string") {
        try {
          coords = JSON.parse(poolImg.coordinate);
        } catch (error) {
          console.error("coordinate JSON parse hatası:", error);
          coords = [];
        }
      } else if (Array.isArray(poolImg.coordinate)) {
        coords = poolImg.coordinate;
      }

      setPolygons(coords);
      setImage(poolImg.image);
    }
  }, [poolImg]);

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [dragging, setDragging] = useState({
    type: null,
    polygonIndex: null,
    pointIndex: null,
  });
  const [dragOffset, setDragOffset] = useState(null);
  const [containerSize, setContainerSize] = useState({
    width: 600,
    height: 400,
  });
  const [imageMetrics, setImageMetrics] = useState({
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1,
  });
  const [form, setForm] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
    f: "",
    answer: "",
    bookletId: "",
    difLevelId: "",
    questionCategoryId: "",
  });
  const { imgBooklets } = useSelector((state) => state.booklet);
  const { questionCats, difLevels } = useSelector((state) => state.queDif);

  useEffect(() => {
    dispatch(getDifLevelsThunk());
    dispatch(getQuestionCatThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getImgBookletsThunk());
  }, [dispatch]);

  const selectedBooklet = imgBooklets.find(
    (b) => b.id === parseInt(form.bookletId)
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (let ent of entries) {
        const { width, height } = ent.contentRect;
        setContainerSize({ width, height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleImageLoad = () => {
    const imgEl = imageRef.current;
    if (!imgEl) return;

    const natW = imgEl.naturalWidth;
    const natH = imgEl.naturalHeight;
    const displayW = imgEl.clientWidth;
    const displayH = imgEl.clientHeight;

    const scaleX = displayW / natW;
    const scaleY = displayH / natH;

    setImageMetrics({ offsetX: 0, offsetY: 0, scaleX, scaleY });
  };

  // Handlers
  const handleQuestionChange = (content) =>
    setForm((f) => ({ ...f, question: content }));

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setPolygons([]);
    setCurrentPolygon([]);
  };

  const handleClick = (e) => {
    if (!imageRef.current || e.target !== imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const threshold = 10;
    const isNear = (p) => Math.hypot(p.x - x, p.y - y) < threshold;
    const tooClose =
      polygons.some((poly) => poly.some(isNear)) || currentPolygon.some(isNear);
    if (!tooClose) setCurrentPolygon((p) => [...p, { x, y }]);
  };

  const handleClearPolygons = () => {
    setPolygons([]);
    setCurrentPolygon([]);
  };

  const handleRightClickFinish = (e) => {
    e.preventDefault();
    if (currentPolygon.length >= 3) {
      setPolygons((p) => [...p, currentPolygon]);
      setCurrentPolygon([]);
    } else alert("Polygon oluşturmak için en az 3 nokta gerekli.");
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPoint({ x, y });

    if (dragging.type === "polygon") {
      const dx = x - dragOffset.x;
      const dy = y - dragOffset.y;
      setPolygons((prev) =>
        prev.map((poly, idx) =>
          idx === dragging.polygonIndex
            ? poly.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }))
            : poly
        )
      );
      setDragOffset({ x, y });
    }

    if (dragging.type === "point") {
      if (dragging.polygonIndex === -1) {
        setCurrentPolygon((prev) =>
          prev.map((pt, i) => (i === dragging.pointIndex ? { x, y } : pt))
        );
      } else {
        setPolygons((prev) =>
          prev.map((poly, pIdx) =>
            pIdx === dragging.polygonIndex
              ? poly.map((pt, i) => (i === dragging.pointIndex ? { x, y } : pt))
              : poly
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    setDragging({ type: null, polygonIndex: null, pointIndex: null });
    setDragOffset(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("file", imageFile);
      }
      formData.append(
        "coordinate",
        JSON.stringify([...polygons, currentPolygon])
      );
      formData.append("question", form.question);
      formData.append("bookletId", parseInt(form.bookletId));
      formData.append("difLevelId", parseInt(form.difLevelId));
      formData.append("questionCategoryId", parseInt(form.questionCategoryId));

      Object.entries(form).forEach(([key, value]) => {
        if (
          [
            "bookletId",
            "difLevelId",
            "questionCategoryId",
            "question",
          ].includes(key)
        )
          return;
        formData.append(key, value);
      });

      dispatch(updatePoolImgThunk({ id, formData }));
    } catch (error) {
      console.error("Gönderme hatası:", error);
      alert("Gönderme sırasında hata oluştu.");
    }
  };

  return (
    <div className="poolImg-container">
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <Sidebar />
      </div>
      <div className="poolImg-content" style={{ marginLeft: "260px" }}>
        <h2
          className="mb-4 text-center d-flex align-items-center justify-content-center"
          style={{
            fontWeight: "600",
            fontSize: "1.5rem",
            color: "#001b66",
            gap: "10px",
          }}
        >
          <i
            className="bi bi-pencil-square"
            style={{ fontSize: "1.6rem", color: "#001b66" }}
          ></i>
          Görüntü Soru Güncelle
        </h2>

        <div className="content-columns">
          {/* Sol Sütun */}
          <div className="left-column">
            <div
              className="d-flex flex-wrap align-items-center gap-2"
              style={{ marginTop: 10 }}
            >
              <button
                onClick={handleClearPolygons}
                className="btn"
                style={{
                  backgroundColor: "#001b66",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#003399")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#001b66")
                }
              >
                <i
                  className="bi bi-trash"
                  style={{ fontSize: "16px", color: "white" }}
                ></i>
                Tüm Polygonları Temizle
              </button>
            </div>

            {image && (
              <div
                ref={containerRef}
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginTop: 20,
                }}
              >
                <img
                  ref={imageRef}
                  src={image}
                  alt="Main"
                  style={{ display: "block", maxWidth: "100%" }}
                  onLoad={handleImageLoad}
                />

                <PolygonEditor
                  imageRef={imageRef}
                  imageSrc={image}
                  polygons={polygons}
                  currentPolygon={currentPolygon}
                  hoverPoint={hoverPoint}
                  dragging={dragging}
                  onClick={handleClick}
                  onMove={handleMouseMove}
                  onUp={handleMouseUp}
                  onStartDragPolygon={(e, idx) => {
                    e.stopPropagation();
                    const rect = imageRef.current.getBoundingClientRect();
                    setDragging({ type: "polygon", polygonIndex: idx });
                    setDragOffset({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  onStartDragPoint={(e, pIdx, ptIdx) => {
                    e.stopPropagation();
                    setDragging({
                      type: "point",
                      polygonIndex: pIdx,
                      pointIndex: ptIdx,
                    });
                  }}
                  onAddMidPoint={(e, pIdx, i, mid) => {
                    e.stopPropagation();
                    setPolygons((prev) =>
                      prev.map((poly, idx) =>
                        idx === pIdx
                          ? [...poly.slice(0, i + 1), mid, ...poly.slice(i + 1)]
                          : poly
                      )
                    );
                  }}
                  onRightClickFinish={handleRightClickFinish}
                />
              </div>
            )}

            <div className="mt-3">
              <QuestionEditor
                value={form.question}
                onChange={handleQuestionChange}
              />
            </div>
          </div>

          {/* Sağ Sütun */}
          <div className="right-column">
            <div style={{ marginTop: 20 }}>
              {Object.entries(form).map(([field, value]) =>
                field === "question" ||
                field === "difLevelId" ||
                field === "bookletId" ||
                field === "questionCategoryId" ? null : (
                  <div key={field} style={{ marginBottom: 8 }}>
                    <label style={{ display: "inline-block", width: 120 }}>
                      {field}:
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={value}
                      onChange={handleFormChange}
                      style={{
                        padding: 6,
                        width: 300,
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 14,
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#001b66")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#cbd5e1")
                      }
                    />
                  </div>
                )
              )}

              {/* Kitapçık */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "inline-block", width: 120 }}>
                  Kitapçık
                </label>
                <select
                  name="bookletId"
                  value={form.bookletId}
                  onChange={handleFormChange}
                  required
                  style={{
                    padding: 6,
                    width: 300,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#cbd5e1")
                  }
                >
                  <option value="">Seçiniz</option>
                  {imgBooklets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                {form.bookletId && (
                  <p className="small text-muted">
                    {imgBooklets.find((b) => b.id === parseInt(form.bookletId))
                      ?.question_count ?? "Soru sayısı bilgisi yok"}
                  </p>
                )}
              </div>

              {/* Zorluk */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "inline-block", width: 120 }}>
                  Zorluk Seviyesi:
                </label>
                <select
                  name="difLevelId"
                  value={form.difLevelId}
                  onChange={handleFormChange}
                  style={{
                    padding: 6,
                    width: 300,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#cbd5e1")
                  }
                >
                  <option value="">Seçiniz</option>
                  {difLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kategori */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "inline-block", width: 120 }}>
                  Soru Kategorisi:
                </label>
                <select
                  name="questionCategoryId"
                  value={form.questionCategoryId}
                  onChange={handleFormChange}
                  style={{
                    padding: 6,
                    width: 300,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#cbd5e1")
                  }
                >
                  <option value="">Seçiniz</option>
                  {questionCats.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                marginTop: 10,
                backgroundColor: "#001b66",
                color: "#fff",
                border: "none",
                padding: "12px 30px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 5px 15px #001b66cc",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003399")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#001b66")
              }
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
