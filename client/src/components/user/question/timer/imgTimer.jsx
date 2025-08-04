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
  const isTimeless = duration === 999999;
  const [remainingTime, setRemainingTime] = useState(
    isTimeless ? null : duration
  );
  const intervalRef = useRef(null);
  const onTimeUpCalled = useRef(false); // <--- Yeni Ref

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setRemainingTime(isTimeless ? null : duration);
    onTimeUpCalled.current = false; // <--- Yeni anahtar değiştiğinde sıfırla
  }, [duration, resetKey, isTimeless]);

  useEffect(() => {
    if (isTimeless) {
      clearInterval(intervalRef.current);
      return;
    } // Kontrol ekledik: Eğer süre bittiyse ve fonksiyon zaten çağrıldıysa tekrar çağırma

    if (remainingTime <= 0 && !onTimeUpCalled.current) {
      clearInterval(intervalRef.current);
      onTimeUp?.();
      onTimeUpCalled.current = true; // <--- Fonksiyonun çağrıldığını işaretle
      return;
    }

    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    } // Interval zaten varsa temizle, yenisini kur

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [remainingTime, isPaused, onTimeUp, isTimeless]);

  const percentage = isTimeless ? 100 : (remainingTime / duration) * 100;

  let color = "#3b82f6";
  if (!isTimeless) {
    if (remainingTime <= 10) color = "#ef4444";
    else if (remainingTime <= duration / 2) color = "#f59e0b";
  }

  const isDanger = !isTimeless && remainingTime <= 10;
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const size = isMobile ? 90 : 140;
  const padding = isMobile ? 8 : 12;
  const textSize = isMobile ? "16px" : "22px";

  return (
    <>
            <style>{blinkStyle}</style>     {" "}
      {isMobile ? (
        <div style={mobileStyles} aria-live="polite" role="timer">
                    Kalan Süre:{" "}
          {isTimeless ? "Süresiz" : formatTime(remainingTime)}       {" "}
        </div>
      ) : (
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
                   {" "}
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
                 {" "}
        </div>
      )}
         {" "}
    </>
  );
}
