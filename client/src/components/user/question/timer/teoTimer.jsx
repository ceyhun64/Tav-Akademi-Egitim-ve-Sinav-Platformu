import { useEffect, useState, useRef } from "react";

export default function CountdownTimer({ duration, onTimeUp, isPaused }) {
  const [remainingTime, setRemainingTime] = useState(
    duration === 999999 ? null : duration * 60
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    if (duration === 999999) {
      setRemainingTime(null); // süresiz
    } else {
      setRemainingTime(duration * 60);
    }
  }, [duration]);

  useEffect(() => {
    if (duration === 999999) {
      // Süresiz, interval yok
      clearInterval(intervalRef.current);
      return;
    }

    if (remainingTime <= 0) {
      onTimeUp();
      clearInterval(intervalRef.current);
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
  }, [remainingTime, isPaused, onTimeUp, duration]);

  const formatTime = (seconds) => {
    if (seconds === null) return "Süresiz";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        fontSize: "0.9rem",
        fontWeight: "600",
        color:
          remainingTime !== null && remainingTime <= 30 ? "#ffebee" : "#c5cae9",
        background:
          remainingTime !== null && remainingTime <= 30
            ? "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)"
            : "linear-gradient(135deg, #283593 0%, #3949ab 100%)",
        borderRadius: "10px",
        marginBottom: "0.5rem",
        boxShadow:
          remainingTime !== null && remainingTime <= 30
            ? "0 4px 10px rgba(211, 47, 47, 0.6)"
            : "0 4px 10px rgba(40, 53, 147, 0.6)",
        transition: "all 0.3s ease",
        userSelect: "none",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        letterSpacing: "0.03em",
        display: "inline-block",
        minWidth: "200px",
        padding: "0.4rem 0.6rem",
        boxSizing: "border-box",
        border:
          remainingTime !== null && remainingTime <= 30
            ? "1px solid #b71c1c"
            : "1px solid #1a237e",
      }}
      aria-live="polite"
      role="timer"
    >
      Kalan Süre: {formatTime(remainingTime)}
    </div>
  );
}
