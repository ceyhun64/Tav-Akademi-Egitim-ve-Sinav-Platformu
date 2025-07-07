import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// CSS animasyonu eklemek için stil bloğu (isteğe bağlı başka yere de alınabilir)
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
  const [remainingTime, setRemainingTime] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemainingTime(duration);
  }, [duration, resetKey]);

  useEffect(() => {
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
  }, [remainingTime, isPaused, onTimeUp]);

  const percentage = (remainingTime / duration) * 100;

  // Renk durumu: mavi > turuncu > kırmızı
  let color = "#3b82f6"; // mavi
  if (remainingTime <= 10) color = "#ef4444"; // kırmızı
  else if (remainingTime <= duration / 2) color = "#f59e0b"; // turuncu

  const isDanger = remainingTime <= 10;

  return (
    <div
      style={{
        width: 140,
        height: 140,
        padding: 12,
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
      {/* Inline stil olarak <style> bloğu ekle (bir defa DOM'a yerleştirilir) */}
      <style>{blinkStyle}</style>

      <CircularProgressbar
        value={percentage}
        text={`${remainingTime}s`}
        styles={buildStyles({
          pathColor: color,
          textColor: color,
          trailColor: "rgba(255, 255, 255, 0.15)",
          textSize: "22px",
          pathTransitionDuration: 0.3,
          strokeLinecap: "round",
        })}
      />
    </div>
  );
}
