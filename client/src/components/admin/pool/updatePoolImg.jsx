import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  updatePoolImgThunk,
  getPoolImgByIdThunk,
} from "../../../features/thunks/poolImgThunk";
import QuestionEditor from "./questionEditor";
import PolygonEditor from "./polygonEditor";
import DraggableOverlayImage from "./draggableOverlayImag"; // Added import
import ImageBlender from "./imageBlender"; // Added import
import {
  getDifLevelsThunk,
  getQuestionCatThunk,
} from "../../../features/thunks/queDifThunk";
import Sidebar from "../adminPanel/sidebar";
import { getBanSubsThunk } from "../../../features/thunks/banSubsThunk";
import { getImgBookletsThunk } from "../../../features/thunks/bookletThunk";

// This function is moved here to be accessible within UpdatePoolImg
function processOverlayImage(file, callback) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = (e) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: true });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const threshold = 240;

      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r < threshold || g < threshold || b < threshold) {
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);

          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      const width = maxX - minX + 1;
      const height = maxY - minY + 1;

      if (width <= 0 || height <= 0) {
        const emptyCanvas = document.createElement("canvas");
        const emptyCtx = emptyCanvas.getContext("2d", { alpha: true });
        emptyCanvas.width = 1;
        emptyCanvas.height = 1;
        callback(emptyCanvas.toDataURL("image/png"));
        return;
      }

      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d", { alpha: true });
      croppedCanvas.width = width;
      croppedCanvas.height = height;

      croppedCtx.drawImage(
        canvas,
        minX,
        minY,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const croppedImageUrl = croppedCanvas.toDataURL("image/png");
      callback(croppedImageUrl);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

export default function UpdatePoolImg() {
  const { id } = useParams();
  const { poolImg } = useSelector((state) => state.poolImg);
  const dispatch = useDispatch();

  const { banSubs } = useSelector((state) => state.banSubs);
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
      // Set initial overlay image and blend mode if available from poolImg
      if (poolImg.overlayImage) {
        setOverlayImage(poolImg.overlayImage);
      }
      if (poolImg.blendMode) {
        setBlendMode(poolImg.blendMode);
      }
    }
  }, [poolImg]);

  useEffect(() => {
    dispatch(getBanSubsThunk());
  }, [dispatch]);

  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const imageBlenderRef = useRef();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayImageFile, setOverlayImageFile] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [blendMode, setBlendMode] = useState("multiply"); // Default blend mode, as in CreatePoolImg
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 }); // Added for DraggableOverlayImage
  const [overlaySize, setOverlaySize] = useState({ width: 50, height: 50 }); // Added for DraggableOverlayImage
  const [blendedDataUrl, setBlendedDataUrl] = useState(null); // Added for blended image URL
  const [blendedUrl, setBlendedUrl] = useState(null); // Added for blended image URL

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

  const handleClearImages = () => {
    setImage(null);
    setImageFile(null);
    setBlendedDataUrl(null);
    setBlendedUrl(null);
    setPolygons([]); // Also clear polygons when images are cleared
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
    if (!blendedDataUrl) {
      window.alert("Birleşik görsel henüz hazırlanmadı. Lütfen bekleyin.");
      return;
    }

    if (!form.answer) {
      window.alert("Lütfen bir cevap seçin.");
      return;
    }

    try {
      const formData = new FormData();

      const blob = await (await fetch(blendedDataUrl)).blob();
      const mergedFile = new File([blob], "merged-image.png", {
        type: "image/png",
      });

      formData.append("file", mergedFile);
      formData.append(
        "coordinate",
        JSON.stringify([...polygons, currentPolygon])
      );
      formData.append("question", form.question);
      formData.append("bookletId", parseInt(form.bookletId));
      formData.append("difLevelId", parseInt(form.difLevelId));
      formData.append("questionCategoryId", parseInt(form.questionCategoryId));
      formData.append("blendMode", blendMode); // Append blend mode

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

      dispatch(updatePoolImgThunk({ id, formData }))
        .unwrap()
        .then((response) => {
          window.alert("Soru başarıyla güncellendi.");
          // You might want to reset some states after a successful update,
          // similar to createPoolImg, if appropriate for your UX.
        })
        .catch((error) => {
          console.error("Gönderme hatası:", error);
          window.alert("Gönderme sırasında hata oluştu.");
        });
    } catch (error) {
      console.error("Gönderme hatası:", error);
      window.alert("Gönderme sırasında hata oluştu.");
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Responsive state management
  const [isMobile, setIsMobile] = useState(false); // < 768px
  const [isTablet, setIsTablet] = useState(false); // 768px - 1200px
  const TABLET_BREAKPOINT = 768;
  const DESKTOP_BREAKPOINT = 1200;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < TABLET_BREAKPOINT);
      setIsTablet(width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT);
      // Keep sidebar open on larger screens, closed on smaller
      setSidebarOpen(width >= TABLET_BREAKPOINT); // Open on tablet and desktop
    };

    handleResize(); // Set dimensions on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectWidth = 300; // Common width for both mobile and desktop

  // Determine grid template columns for content-columns
  const gridTemplateColumnsStyle = isMobile || isTablet ? "1fr" : "2fr 1fr";

  useEffect(() => {
    if (image && overlayImage && imageBlenderRef.current) {
      // Small delay to allow images to fully load and component to update
      const timer = setTimeout(() => {
        const blended = imageBlenderRef.current.getDataUrl();
        if (blended) {
          setBlendedUrl(blended);
          setBlendedDataUrl(blended); // Ensure blendedDataUrl is also updated
        }
      }, 300);
      return () => clearTimeout(timer); // Cleanup timeout
    } else {
      // If either image or overlayImage is null, clear blended URLs
      setBlendedUrl(null);
      setBlendedDataUrl(null);
    }
  }, [image, overlayImage, blendMode, overlayPosition, overlaySize]); // Added overlayPosition n and overlaySize to dependencies for real-time blending
  useEffect(() => {
    console.log(showOverlay);
  }, [showOverlay]); // Debugging line to check showOverlay state
  return (
    <div className="poolImg-container" style={{ overflowX: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>
      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
      >
        <h2
          className="mb-4 mt-2 ms-4 d-flex align-items-center"
          style={{
            fontWeight: "600",
            fontSize: "1.5rem",
            color: "#001b66",
            gap: "10px",
            justifyContent: "flex-start",
          }}
        >
          <i
            className="bi bi-pencil-square"
            style={{ fontSize: "1.6rem", color: "#001b66" }}
          ></i>
          Uygulamalı Soru Güncelle
          <button
            onClick={() => window.history.back()}
            style={{
              marginLeft: isMobile ? "auto" : "30px",
              backgroundColor: "#001b66",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: "1rem",
              whiteSpace: "nowrap",
            }}
          >
            Geri Dön
          </button>
        </h2>
        {image && overlayImage && (
          <ImageBlender
            ref={imageBlenderRef}
            baseImageSrc={image}
            overlayImageSrc={overlayImage}
            overlayPosition={overlayPosition}
            overlaySize={overlaySize}
            imageMetrics={imageMetrics}
            blendMode={blendMode}
            onBlendComplete={(dataUrl) => {
              setBlendedDataUrl(dataUrl);
              setBlendedUrl(dataUrl);
              setShowOverlay(true); // Ensure overlay is shown after blend
            }}
          />
        )}
        <div
          className="content-columns"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile || isTablet ? "1fr" : "2fr 1fr",
            gap: isMobile ? "10px" : "20px",
          }}
        >
          <div className="left-column">
            {/* Added the new features here */}
            <div
              className="d-flex flex-wrap align-items-center gap-2"
              style={{ marginTop: 10 }}
            >
              <div
                style={{
                  width: "100%",
                  color: "#b00020",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  marginBottom: "6px",
                  userSelect: "none",
                }}
              >
                ⚠️ Lütfen efekt vermeden önce yasaklı maddenin yerini ayarlamayı
                ve polygonu çizmeyi unutmayınız !
              </div>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  padding: "4px 10px",
                  userSelect: "none",
                  gap: "6px",
                  fontWeight: 600,
                  color: "#001b66",
                  fontSize: "0.9rem",
                }}
              >
                <i className="bi bi-bag-fill" style={{ fontSize: "16px" }}></i>
                X-RAY Görseli Ekle
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
              </label>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: "#001b66",
                  backgroundColor: "#e7eaf9",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  boxShadow: "0 2px 6px rgba(0, 27, 102, 0.2)",
                  border: "none",
                  userSelect: "none",
                  gap: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <i
                  className="bi bi-radioactive"
                  style={{ fontSize: "16px" }}
                ></i>
                Tehlikeli Madde Ekle
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    processOverlayImage(file, (processedUrl) => {
                      console.log("Overlay yüklendi:", processedUrl); // BURAYA BAK
                      setOverlayImage(processedUrl);
                      setShowOverlay(true);
                    });
                  }}
                />
              </label>
              <select
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value)}
                style={{
                  padding: isMobile || isTablet ? "4px 8px" : "6px 12px",
                  fontSize: isMobile || isTablet ? "0.85rem" : "0.95rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg fill='gray' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  backgroundSize: "14px 14px",
                  minWidth: "140px",
                }}
              >
                <option value="*">Efekt Seçiniz</option>
                <option value="multiply">Multiply</option>
                <option value="darken">Darken</option>
                <option value="darkerColor">Darker Color</option>
                <option value="mod4">Mod 4</option>
                <option value="mod5">Mod 5</option>
              </select>
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
              {/* New button to clear images */}
              <button
                onClick={handleClearImages}
                className="btn"
                style={{
                  backgroundColor: "#dc3545",
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
                  (e.currentTarget.style.backgroundColor = "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc3545")
                }
              >
                <i
                  className="bi bi-image-fill"
                  style={{ fontSize: "16px", color: "white" }}
                ></i>
                Görselleri Temizle
              </button>
            </div>
            {image && (
              <div
                ref={containerRef}
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginTop: 20,
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  ref={imageRef}
                  src={image}
                  alt="Main"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  onLoad={handleImageLoad}
                />
                {blendedUrl && (
                  <img
                    src={blendedUrl}
                    alt="Blended"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      maxWidth: "100%",
                      height: "auto",
                      pointerEvents: "none",
                      zIndex: 10,
                      opacity: 0.8,
                    }}
                  />
                )}
                {showOverlay && overlayImage && (
                  <DraggableOverlayImage
                    showOverlay={showOverlay}
                    src={overlayImage}
                    containerRef={containerRef}
                    onPositionChange={setOverlayPosition}
                    onSizeChange={setOverlaySize}
                  />
                )}
                <PolygonEditor
                  style={{ position: "relative", zIndex: 10000 }}
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
          <div
            className="right-column"
            style={{
              display: isMobile ? "flex" : "block",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div>
              {Object.entries(form).map(([field, value]) => {
                const isExcluded =
                  field === "question" ||
                  field === "difLevelId" ||
                  field === "bookletId" ||
                  field === "questionCategoryId" ||
                  field === "answer";

                if (isExcluded) return null;

                return (
                  <div
                    key={field}
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      width: isMobile ? "90%" : 300,
                      justifyContent: isMobile ? "center" : "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    {/* Sol harf kutusu */}
                    <div
                      onClick={() =>
                        setForm((prev) => ({ ...prev, answer: field }))
                      }
                      style={{
                        width: 40,
                        backgroundColor:
                          form.answer === field ? "#001b66" : "#e2e8f0",
                        color: form.answer === field ? "#fff" : "#001b66",
                        padding: "10px",
                        textAlign: "center",
                        marginBottom: 15,
                        fontWeight: "bold",
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                        transition: "all 0.2s ease-in-out",
                        flexShrink: 0,
                      }}
                      title="Doğru cevabı seç"
                    >
                      {field.toUpperCase()}
                    </div>
                    {/* Sağ taraf: Select kutusu */}
                    <select
                      name={field}
                      value={value}
                      onChange={handleFormChange}
                      style={{
                        width: selectWidth,
                        padding: "10px",
                        border: "1px solid #cbd5e1",
                        borderLeft: "none",
                        marginBottom: 15,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
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
                      <option value="">Yasaklı Madde Seçiniz</option>
                      {banSubs.map((item) => {
                        const otherSelectedValues = Object.entries(form)
                          .filter(
                            ([key]) =>
                              key !== field &&
                              key !== "question" &&
                              key !== "difLevelId" &&
                              key !== "bookletId" &&
                              key !== "questionCategoryId" &&
                              key !== "answer"
                          )
                          .map(([_, val]) => val);

                        const isDisabled = otherSelectedValues.includes(
                          item.name
                        );

                        return (
                          <option
                            key={item.id}
                            value={item.name}
                            disabled={isDisabled}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })}
              {/* Kitapçık seçimi */}
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
                    padding: 10,
                    width: selectWidth,
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
              </div>
              {/* Zorluk Seviyesi */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "inline-block", width: 120 }}>
                  Zorluk Seviyesi:
                </label>
                <select
                  name="difLevelId"
                  value={form.difLevelId}
                  onChange={handleFormChange}
                  style={{
                    padding: 10,
                    width: selectWidth,
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
              {/* Soru Kategorisi */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "inline-block", width: 120 }}>
                  Soru Kategorisi:
                </label>
                <select
                  name="questionCategoryId"
                  value={form.questionCategoryId}
                  onChange={handleFormChange}
                  style={{
                    padding: 10,
                    width: selectWidth,
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
