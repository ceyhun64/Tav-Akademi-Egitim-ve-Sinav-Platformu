import React, { useEffect, useRef, useState } from "react";

export default function FullscreenWrapper({
  children,
  onExitFullscreen,
  examEnded,
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const requestFullscreen = () => {
    const elem = containerRef.current;
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
    // İlk renderda ve examEnded değiştiğinde tam ekrana geç
    const timer = setTimeout(() => {
      if (!examEnded) {
        requestFullscreen();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [examEnded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullScreen =
        document.fullscreenElement === examContainerRef.current ||
        document.webkitFullscreenElement === examContainerRef.current ||
        document.mozFullScreenElement === examContainerRef.current ||
        document.msFullscreenElement === examContainerRef.current;

      if (!isFullScreen && !examEnded) {
        // Tam ekrandan çıkılmaya çalışıldı
        setIsPaused(true);
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // İlk yüklemede tam ekrana geç
    requestFullscreen();

    return () => {
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

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}
