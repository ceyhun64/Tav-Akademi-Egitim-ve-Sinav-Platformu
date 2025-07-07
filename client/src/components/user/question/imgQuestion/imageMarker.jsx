import React, { useRef, useEffect } from "react";

export default function ImageMarker({
  src,
  onImageClick,
  onImageLoad,
  selectedCoordinate,
  activeFilter,
  transparencyAlpha,
  children,
  renderFilteredImage, // fonksiyon olarak geliyor artık
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const mediaElement = containerRef.current?.querySelector("img, canvas");
    if (!mediaElement || !onImageLoad) return;

    const handleLoad = () => {
      const width =
        mediaElement instanceof HTMLImageElement
          ? mediaElement.naturalWidth
          : mediaElement.width;
      const height =
        mediaElement instanceof HTMLImageElement
          ? mediaElement.naturalHeight
          : mediaElement.height;
      onImageLoad({ width, height });
    };

    if (mediaElement.complete || mediaElement.readyState === 2) {
      handleLoad();
    } else {
      mediaElement.addEventListener("load", handleLoad);
    }

    return () => {
      mediaElement?.removeEventListener("load", handleLoad);
    };
  }, [onImageLoad]); // artık renderFilteredImage bağımlı değil

  const handleClick = (e) => {
    if (!containerRef.current) return;

    const mediaElement = containerRef.current.querySelector("img, canvas");
    if (!mediaElement) return;

    const rect = mediaElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const actualWidth =
      mediaElement instanceof HTMLImageElement
        ? mediaElement.naturalWidth
        : mediaElement.width;

    const actualHeight =
      mediaElement instanceof HTMLImageElement
        ? mediaElement.naturalHeight
        : mediaElement.height;

    const scaleX = actualWidth / displayWidth;
    const scaleY = actualHeight / displayHeight;

    const actualX = x * scaleX;
    const actualY = y * scaleY;

    const relativeX = actualX / actualWidth;
    const relativeY = actualY / actualHeight;

    onImageClick({ x: relativeX, y: relativeY });
  };

  return (
    <div
      style={{ position: "relative", cursor: "pointer" }}
      ref={containerRef}
      onClick={handleClick}
    >
      {renderFilteredImage ? (
        React.cloneElement(renderFilteredImage, {
          style: {
            width: "100%",
            height: "auto",
            borderRadius: 3,
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          },
          crossOrigin: "anonymous",
          draggable: false,
        })
      ) : (
        <img
          src={src}
          alt="Soru görseli"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 3,
            userSelect: "none",
            pointerEvents: "none",
          }}
          crossOrigin="anonymous"
          draggable={false}
        />
      )}
      {selectedCoordinate && (
        <div
          style={{
            position: "absolute",
            top: `${selectedCoordinate.y * 100}%`,
            left: `${selectedCoordinate.x * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 25,
            height: 25,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Dikey çizgi */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: 1,
              height: "100%",
              backgroundColor: "red",
              transform: "translateX(-50%)",
              boxShadow: "0 0 2px black",
            }}
          />
          {/* Yatay çizgi */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: 1,
              backgroundColor: "red",
              transform: "translateY(-50%)",
              boxShadow: "0 0 2px black",
            }}
          />
          {/* Dış halka */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid red",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 4px black",
              backgroundColor: "rgba(255, 255, 0, 0.1)",
            }}
          />
          {/* İç halka */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "2px solid red",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 0, 0.2)",
              boxShadow: "0 0 2px black",
            }}
          />
          {/* İç nokta */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "yellow",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}
