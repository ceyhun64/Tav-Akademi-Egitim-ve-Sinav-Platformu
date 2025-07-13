import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPoolImgThunk } from "../../../features/thunks/poolImgThunk";
import QuestionEditor from "./questionEditor";
import PolygonEditor from "./polygonEditor";
import DraggableOverlayImage from "./draggableOverlayImag";
import mergeImages from "./imageMerger";
import ImageBlender from "./imageBlender";
import {
  getDifLevelsThunk,
  getQuestionCatThunk,
} from "../../../features/thunks/queDifThunk";
import { getBanSubsThunk } from "../../../features/thunks/banSubsThunk";
import Sidebar from "../adminPanel/sidebar";
import "./createPoolImg.css";

import { getImgBookletsThunk } from "../../../features/thunks/bookletThunk";

function processOverlayImage(file, callback) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = (e) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Canvas'ı oluştururken hala alpha: true kullanmak en güvenli yaklaşımdır.
      // Bu, tarayıcının varsayılan olarak opak bir arka plan eklemesini engeller
      // ve gelecekteki olası uyumluluk sorunlarının önüne geçer.
      const ctx = canvas.getContext("2d", { alpha: true });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Beyaz sayılacak renk aralığı için threshold belirleyin.
      // Örnek: RGB hepsi 240'ın üzerindeyse beyaz say
      const threshold = 240;

      // Kırpma için bounding box'ı başlat
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      // Bu döngü artık pikselleri şeffaf yapmayacak.
      // Sadece beyaz olmayan piksellerin en dış koordinatlarını bulacak.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // data[i+3] (alpha kanalı) burada doğrudan kullanılmıyor,
        // çünkü amacımız beyazı şeffaf yapmak değil, kırpmak.

        // Eğer piksel beyaz değilse (yani RGB değerlerinden en az biri eşik altındaysa), koordinatları al
        // Veya daha genel bir ifadeyle: Eğer piksel "beyaz" olarak kabul edilmiyorsa
        if (r < threshold || g < threshold || b < threshold) {
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);

          // Beyaz olmayan piksellerin en dış koordinatlarını bul
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      // Kırpma boyutlarını hesapla
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;

      // Eğer hiç beyaz olmayan piksel bulunamazsa (resim tamamen beyazsa veya threshold çok yüksekse),
      // bu durumda maxX < minX veya maxY < minY olabilir.
      // Bu durumu ele almak için bir kontrol ekleyelim.
      if (width <= 0 || height <= 0) {
        // Eğer kırpma alanı boşsa, 1x1 şeffaf bir resim döndürebiliriz
        // veya boş bir Data URL döndürerek hata sinyali verebiliriz.
        // Burada şeffaf bir PNG döndürüyoruz.
        const emptyCanvas = document.createElement("canvas");
        const emptyCtx = emptyCanvas.getContext("2d", { alpha: true });
        emptyCanvas.width = 1;
        emptyCanvas.height = 1;
        callback(emptyCanvas.toDataURL("image/png"));
        return;
      }

      // Yeni canvas kırpılmış alan için
      const croppedCanvas = document.createElement("canvas");
      // Kırpılmış canvas'ın da şeffaf bir arka plana sahip olması önemli,
      // aksi takdirde kırpılan görselin kenarları opaklaşabilir.
      const croppedCtx = croppedCanvas.getContext("2d", { alpha: true });
      croppedCanvas.width = width;
      croppedCanvas.height = height;

      // Orijinal canvas'tan (img) kırpılan alanı alıp yeni canvas'a çiz
      croppedCtx.drawImage(
        canvas, // Kaynak canvas (içinde orijinal resim var)
        minX, // Kaynak X koordinatı
        minY, // Kaynak Y koordinatı
        width, // Kaynak genişlik
        height, // Kaynak yükseklik
        0, // Hedef X koordinatı
        0, // Hedef Y koordinatı
        width, // Hedef genişlik
        height // Hedef yükseklik
      );

      // Kırpılmış görseli PNG formatında Data URL olarak callback’e ver
      // JPG yerine PNG kullanmak, şeffaflık ihtiyacı olmasa bile (çünkü artık beyaz kırpıyoruz)
      // daha iyi kalite ve gelecekteki esneklik açısından genellikle tercih edilir.
      const croppedImageUrl = croppedCanvas.toDataURL("image/png");
      callback(croppedImageUrl);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

export default function CreatePoolImg() {
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const { banSubs } = useSelector((state) => state.banSubs);

  // polygons, currentPolygon, form, dispatch gibi state'ler zaten senin mevcut koddadır diye varsayıyorum

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [blendedDataUrl, setBlendedDataUrl] = useState(null);
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
    difLevelId: "", // değişti
    questionCategoryId: "", // değişti
  });
  const { imgBooklets } = useSelector((state) => state.booklet);

  const { questionCats, difLevels } = useSelector((state) => state.queDif);
  useEffect(() => {
    dispatch(getDifLevelsThunk());
    dispatch(getQuestionCatThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBanSubsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getImgBookletsThunk());
  }, [dispatch]);
  console.log(imgBooklets);
  const selectedBooklet = imgBooklets.find(
    (b) => b.id === parseInt(form.bookletId)
  );

  // Resize observer for container
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

  // Compute image metrics
  const handleImageLoad = () => {
    const imgEl = imageRef.current;
    if (!imgEl) return;

    const natW = imgEl.naturalWidth;
    const natH = imgEl.naturalHeight;
    const displayW = imgEl.clientWidth;
    const displayH = imgEl.clientHeight;

    console.log("Image loaded:");
    console.log("Natural width / height:", natW, natH);
    console.log("Displayed width / height:", displayW, displayH);

    if (!natW || !natH || !displayW || !displayH) {
      console.warn("Görsel boyutları alınamadı.");
      return;
    }

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
    console.log("handleSubmit çağrıldı, blendedDataUrl:", blendedDataUrl);
    if (!blendedDataUrl) {
      window.alert("Birleşik görsel henüz hazırlanmadı. Lütfen bekleyin.");
      return;
    }

    try {
      const blob = await (await fetch(blendedDataUrl)).blob();
      const mergedFile = new File([blob], "merged-image.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", mergedFile);

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

      dispatch(createPoolImgThunk(formData))
        .unwrap()
        .then((response) => {
          console.log("Gönderim başarılı:", response);
          window.alert("Soru başarıyla oluşturuldu!");
          setForm({
            bookletId: "",
            difLevelId: "",
            questionCategoryId: "",
            question: "",
          });
          setImage(null);
          setImageFile(null);
          setPolygons([]);
          setCurrentPolygon([]);
          setHoverPoint(null);
        });
    } catch (error) {
      console.error("Gönderim hatası:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [overlaySize, setOverlaySize] = useState({ width: 50, height: 50 });
  const [blendMode, setBlendMode] = useState("multiply");
  const imageBlenderRef = useRef();
  const [blendedUrl, setBlendedUrl] = useState(null);
  useEffect(() => {
    if (image && overlayImage && imageBlenderRef.current) {
      setTimeout(() => {
        const blended = imageBlenderRef.current.getDataUrl();
        if (blended) {
          setBlendedUrl(blended);
        }
      }, 300); // yüklenmesi için biraz zaman tanı
    }
  }, [image, overlayImage, blendMode]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik

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
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
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
          className="mb-4 mt-4 ms-4 d-flex align-items-center"
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
          Uygulamalı Soru Ekle
          <button
            onClick={() => window.history.back()}
            style={{
              marginLeft: isMobile ? "auto" : "50px", // sağa itmek için
              backgroundColor: "#001b66",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Geri Dön
          </button>
        </h2>
        {blendMode && ( // blendMode boş değilse ImageBlender'ı render et
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
              setShowOverlay(true);
              console.log("Blend tamamlandı, dataUrl geldi.");
            }}
          />
        )}
        <div
          className="content-columns"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            gap: isMobile ? "10px" : "20px",
          }}
        >
          <div className="left-column">
            {/* İçerik */}
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
                <i class="bi bi-radioactive" style={{ fontSize: "16px" }}></i>
                Tehlikeli Madde Ekle
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    processOverlayImage(file, (processedUrl) => {
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
                  padding: "6px 12px",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: "",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none", // bazı tarayıcılarda klasik oka engel olur
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "16px 16px",
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
                {blendedUrl && (
                  <img
                    src={blendedUrl}
                    alt="Blended"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      maxWidth: "100%",
                      pointerEvents: "none",
                      zIndex: 10, // Burayı değiştirmene gerek yok, düşük bırak
                      opacity: 0.8,
                    }}
                  />
                )}
                {showOverlay &&
                  overlayImage && ( // Bu koşul artık blendedUrl oluştuğunda false olacak
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
              {Object.entries(form)
                .filter(
                  ([field]) =>
                    field !== "question" &&
                    field !== "difLevelId" &&
                    field !== "bookletId" &&
                    field !== "questionCategoryId" &&
                    field !== "answer"
                )
                .map(([field, value]) => (
                  <div
                    key={field}
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      width: isMobile ? "90%" : 300,
                      cursor: "pointer",
                      justifyContent: isMobile ? "center" : "flex-start",
                    }}
                  >
                    {/* Sol taraf */}
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

                    {/* Select kutusu */}
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
                      {banSubs.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

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
              disabled={!blendedDataUrl}
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
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
