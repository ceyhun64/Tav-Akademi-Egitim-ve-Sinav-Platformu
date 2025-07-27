import React, { useEffect, useRef, useState } from "react";

export default function CustomVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [maxAllowedTime, setMaxAllowedTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        const currentTime = video.currentTime;

        // Geri sarma serbest, ileri sarma engelli
        if (currentTime > maxAllowedTime) {
          video.currentTime = maxAllowedTime;
          video.pause();
        }

        if (currentTime > maxAllowedTime) {
          setMaxAllowedTime(currentTime);
        }

        setProgress((currentTime / duration) * 100);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setMaxAllowedTime(video.currentTime || 0);
      };

      const handleSeeking = () => {
        const currentTime = video.currentTime;
        if (currentTime > maxAllowedTime) {
          video.currentTime = maxAllowedTime;
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("seeking", handleSeeking);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("seeking", handleSeeking);
      };
    }
  }, [maxAllowedTime, duration]);

  const handleSeekClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    const seekTime = duration * clickRatio;

    if (seekTime <= maxAllowedTime) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleRewind = () => {
    const current = videoRef.current.currentTime;
    videoRef.current.currentTime = Math.max(0, current - 10);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <video
        ref={videoRef}
        src={src}
        className="w-full rounded-lg shadow-lg"
        controls={false}
      />

      <div className="flex items-center gap-4 mt-4 justify-center">
        <button
          onClick={handleRewind}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ⏪ 10s
        </button>

        <button
          onClick={() => videoRef.current.play()}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ▶
        </button>

        <button
          onClick={() => videoRef.current.pause()}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ⏸
        </button>
      </div>

      <div
        className="w-full h-3 bg-gray-300 rounded mt-3 cursor-pointer"
        onClick={handleSeekClick}
      >
        <div
          className="h-3 bg-blue-600 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
