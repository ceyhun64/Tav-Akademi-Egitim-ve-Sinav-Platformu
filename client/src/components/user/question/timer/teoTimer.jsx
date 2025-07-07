import { useEffect, useState, useRef } from "react";

export default function CountdownTimer({ duration, onTimeUp, isPaused }) {
  const [remainingTime, setRemainingTime] = useState(duration * 60); // saniye
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemainingTime(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp();
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        fontSize: "1.2rem",
        fontWeight: "700",
        color: remainingTime <= 30 ? "#ffebee" : "#c5cae9",
        background:
          remainingTime <= 30
            ? "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)" // alarm kırmızısı degrade
            : "linear-gradient(135deg, #283593 0%, #3949ab 100%)", // lacivert degrade
        padding: "0.75rem 1.5rem",
        borderRadius: "14px",
        marginBottom: "1rem",
        boxShadow:
          remainingTime <= 30
            ? "0 6px 16px rgba(211, 47, 47, 0.7)"
            : "0 6px 16px rgba(40, 53, 147, 0.7)",
        transition: "all 0.4s ease",
        userSelect: "none",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        letterSpacing: "0.04em",
        display: "inline-block",
        minWidth: "280px",
        boxSizing: "border-box",
        border: remainingTime <= 30 ? "2px solid #b71c1c" : "2px solid #1a237e",
      }}
      aria-live="polite"
      role="timer"
    >
      Kalan Süre: {formatTime(remainingTime)}
    </div>
  );
}
