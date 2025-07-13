import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const blinkStyle = `
@keyframes blink {
  0%, 100% { background-color: #fee2e2; }
  50% { background-color: #fecaca; }
}
`;

export default function CircleCountdownTimer({
  duration,
  onTimeUp,
  resetKey,
  isPaused = false,
}) {
  // duration 0 ise süresiz, yani kalan süre sonsuz kabul ediliyor
  const isTimeless = duration === 0;

  // Başlangıçta duration veya sonsuz (süresiz) olarak ayarla
  const [remainingTime, setRemainingTime] = useState(
    isTimeless ? null : duration
  );
  const intervalRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setRemainingTime(isTimeless ? null : duration);
  }, [duration, resetKey, isTimeless]);

  useEffect(() => {
    if (isTimeless) {
      // Süresizse interval yok, fonksiyon çağrılmaz
      clearInterval(intervalRef.current);
      return;
    }

    if (remainingTime <= 0) {
      clearInterval(intervalRef.current);
      onTimeUp?.();
      return;
    }

    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [remainingTime, isPaused, onTimeUp, isTimeless]);

  const percentage = isTimeless ? 100 : (remainingTime / duration) * 100;

  // Renk seçimi (süresiz için default renk)
  let color = "#3b82f6";
  if (!isTimeless) {
    if (remainingTime <= 10) color = "#ef4444";
    else if (remainingTime <= duration / 2) color = "#f59e0b";
  }

  const isDanger = !isTimeless && remainingTime <= 10;

  // Format zamanı MM:SS yapacak fonksiyon
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Mobil görünümde metinsel sayaç için stiller ve renkler
  const mobileStyles = {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: isDanger ? "#ffebee" : "#c5cae9",
    background: isDanger
      ? "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)"
      : "linear-gradient(135deg, #283593 0%, #3949ab 100%)",
    borderRadius: "10px",
    marginBottom: "0.5rem",
    boxShadow: isDanger
      ? "0 4px 10px rgba(211, 47, 47, 0.6)"
      : "0 4px 10px rgba(40, 53, 147, 0.6)",
    transition: "all 0.3s ease",
    userSelect: "none",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "0.03em",
    display: "inline-block",
    minWidth: "160px",
    padding: "0.4rem 0.6rem",
    boxSizing: "border-box",
    border: isDanger ? "1px solid #b71c1c" : "1px solid #1a237e",
    animation: isDanger ? "blink 1s infinite" : "none",
  };

  // Masaüstü boyutları
  const size = isMobile ? 90 : 140;
  const padding = isMobile ? 8 : 12;
  const textSize = isMobile ? "16px" : "22px";

  return (
    <>
      <style>{blinkStyle}</style>

      {isMobile ? (
        // Mobilde metinsel gösterim
        <div style={mobileStyles} aria-live="polite" role="timer">
          Kalan Süre: {isTimeless ? "Süresiz" : formatTime(remainingTime)}
        </div>
      ) : (
        // Masaüstünde dairesel gösterim
        <div
          style={{
            width: size,
            height: size,
            padding: padding,
            backgroundColor: isDanger ? "#fee2e2" : "#ffffff",
            borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(30, 58, 138, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: isDanger ? "blink 1s infinite" : "none",
            transition: "background-color 0.3s ease",
          }}
        >
          <CircularProgressbar
            value={percentage}
            text={isTimeless ? "Süresiz" : `${remainingTime}s`}
            styles={buildStyles({
              pathColor: color,
              textColor: color,
              trailColor: "rgba(255, 255, 255, 0.15)",
              textSize: textSize,
              pathTransitionDuration: 0.3,
              strokeLinecap: "round",
            })}
          />
        </div>
      )}
    </>
  );
}
