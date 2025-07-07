import { useEffect, useRef, useState } from "react";

export default function useExamSecurity({ examEnded }) {
  const examContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

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

  const handleConfirmWarning = () => {
    setShowFullscreenWarning(false);
    setIsPaused(false);
    requestFullscreen();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      requestFullscreen();
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
        setIsPaused(true);
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

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

  useEffect(() => {
    const handlePopState = () => {
      setIsPaused(true);
      setShowFullscreenWarning(true);
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examEnded) {
        setIsPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examEnded]);

  return {
    examContainerRef,
    isPaused,
    setIsPaused,
    showFullscreenWarning,
    setShowFullscreenWarning,
    onConfirmWarning: handleConfirmWarning,
  };
}
