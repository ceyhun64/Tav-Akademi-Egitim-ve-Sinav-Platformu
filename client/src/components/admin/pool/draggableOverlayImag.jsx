import React, { useState, useEffect } from "react";

export default function DraggableOverlayImage({
  src,
  containerRef,
  onPositionChange,
  onSizeChange,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 50, height: 50 });
  const [resizing, setResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState(null);

  // Load image and calculate initial size & position
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const maxWidth = screenWidth * 0.3;
      const maxHeight = screenHeight * 0.3;

      let scale = 1;
      if (img.naturalWidth > maxWidth || img.naturalHeight > maxHeight) {
        scale = Math.min(
          maxWidth / img.naturalWidth,
          maxHeight / img.naturalHeight
        );
      }

      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      setDisplaySize({ width: scaledWidth, height: scaledHeight });
      if (onSizeChange)
        onSizeChange({ width: scaledWidth, height: scaledHeight });

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const startX = rect.width / 2 - scaledWidth / 2;
        const startY = rect.height / 2 - scaledHeight / 2;

        setPosition({ x: startX, y: startY });
        if (onPositionChange) onPositionChange({ x: startX, y: startY });
      }
    };
  }, [src]);

  // Handle dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setDragging(true);
    setOffset({
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging && containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - rect.left - offset.x;
      let newY = e.clientY - rect.top - offset.y;

      newX = Math.max(0, Math.min(newX, rect.width - displaySize.width));
      newY = Math.max(0, Math.min(newY, rect.height - displaySize.height));

      setPosition({ x: newX, y: newY });
      if (onPositionChange) onPositionChange({ x: newX, y: newY });
    }

    if (resizing && resizeStart && containerRef?.current) {
      const dx = e.clientX - resizeStart.startX;
      const dy = e.clientY - resizeStart.startY;
      const newWidth = Math.max(20, resizeStart.width + dx);
      const newHeight = Math.max(20, resizeStart.height + dy);
      setDisplaySize({ width: newWidth, height: newHeight });
      if (onSizeChange) onSizeChange({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, offset, resizeStart, displaySize]);

  const startResizing = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    setResizeStart({
      startX: e.clientX,
      startY: e.clientY,
      width: displaySize.width,
      height: displaySize.height,
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: displaySize.width,
        height: displaySize.height,
        zIndex: 9999,
        userSelect: "none",
        cursor: dragging ? "grabbing" : "move",
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={src}
        alt="overlay"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none", // click dragging is handled by container div
        }}
        draggable={false}
      />
      {/* Resize handle in bottom-right */}
      <div
        onMouseDown={startResizing}
        style={{
          position: "absolute",
          width: 12,
          height: 12,
          bottom: 0,
          right: 0,
          background: "#333",
          cursor: "nwse-resize",
          zIndex: 10000,
        }}
      />
    </div>
  );
}
