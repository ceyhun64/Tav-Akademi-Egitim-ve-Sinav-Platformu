import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setRemainingTime } from "../../../../features/slices/durationSlice"; // <- Yolunu özelleştir

const blinkStyle = `
@keyframes blink {
  0%, 100% { background-color: #fee2e2; }
  50% { background-color: #fecaca; }
}
`;

export default function CountdownTimer({
  questionId,
  duration,
  onTimeUp,
  onTick,
  isPaused = false,
}) {
  const dispatch = useDispatch();

  const storedTime = useSelector(
    (state) => state.duration.remainingTimes[questionId]
  );
  const defaultDuration = useSelector(
    (state) => state.duration.defaultTimePerQuestion
  );

  const initialTime = storedTime ?? duration ?? defaultDuration;

  const [remainingTime, setRemainingTimeLocal] = useState(initialTime);
  const intervalRef = useRef(null);
  const onTimeUpCalled = useRef(false);

  // Eğer questionId değişirse, store'daki süreyi al
  useEffect(() => {
    const restoredTime = storedTime ?? duration ?? defaultDuration;
    setRemainingTimeLocal(restoredTime);
    onTimeUpCalled.current = false;
  }, [questionId, storedTime, duration, defaultDuration]);

  // Sayaç
  useEffect(() => {
    if (isPaused || remainingTime <= 0 || onTimeUpCalled.current) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingTimeLocal((prev) => {
        const newTime = prev - 1;

        // Redux store'a her saniye kalan süreyi yaz
        dispatch(setRemainingTime({ questionId, time: newTime }));

        if (newTime >= 0) onTick?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, remainingTime, dispatch, questionId, onTick]);

  // Süre bittiyse
  useEffect(() => {
    if (remainingTime <= 0 && !onTimeUpCalled.current) {
      onTimeUpCalled.current = true;
      onTimeUp?.();
    }
  }, [remainingTime, onTimeUp]);

  // Yüzdelik oran ve görünüm
  const percentage = (remainingTime / (duration ?? defaultDuration)) * 100;
  const isDanger = remainingTime <= 10;

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <>
      <style>{blinkStyle}</style>
      <div
        style={{
          width: 120,
          height: 120,
          backgroundColor: isDanger ? "#fee2e2" : "#fff",
          borderRadius: "50%",
          boxShadow: "0 6px 20px rgba(30, 58, 138, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: isDanger ? "blink 1s infinite" : "none",
        }}
      >
        <CircularProgressbar
          value={percentage}
          text={formatTime(remainingTime)}
          styles={buildStyles({
            pathColor: isDanger ? "#ef4444" : "#3b82f6",
            textColor: isDanger ? "#ef4444" : "#3b82f6",
            trailColor: "#eee",
            textSize: "18px",
          })}
        />
      </div>
    </>
  );
}
