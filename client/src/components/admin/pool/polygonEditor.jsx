import React from "react";

export default function PolygonEditor({
  imageRef,
  imageSrc,
  polygons,
  currentPolygon,
  hoverPoint,
  dragging,
  onClick,
  onMove,
  onUp,
  onStartDragPolygon,
  onStartDragPoint,
  onAddMidPoint,
  onRightClickFinish,
}) {
  return (
    <svg
      ref={imageRef}
      width="100%"
      height="100%"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onContextMenu={onRightClickFinish}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        border: "1px solid #ccc",
        cursor: dragging.type ? "pointer" : "crosshair",
        userSelect: "none",
      }}
    >
      {polygons.map((poly, pIdx) => (
        <g key={pIdx}>
          <polygon
            points={poly.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="rgba(0,255,0,0.1)"
            stroke="green"
            strokeWidth={2}
            onMouseDown={(e) => onStartDragPolygon(e, pIdx)}
          />
          {poly.map((pt, i) => {
            const next = poly[(i + 1) % poly.length];
            const mid = { x: (pt.x + next.x) / 2, y: (pt.y + next.y) / 2 };
            return (
              <React.Fragment key={i}>
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="transparent"
                  strokeWidth={10}
                  onClick={(e) => onAddMidPoint(e, pIdx, i, mid)}
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={5}
                  fill="white"
                  stroke="red"
                  strokeWidth={2}
                  onMouseDown={(e) => onStartDragPoint(e, pIdx, i)}
                  style={{ cursor: "grab" }}
                />
              </React.Fragment>
            );
          })}
        </g>
      ))}
      {currentPolygon.length > 0 && (
        <>
          <polygon
            points={currentPolygon.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="rgba(255,0,0,0.1)"
            stroke="red"
            strokeWidth={2}
          />
          {hoverPoint && (
            <line
              x1={currentPolygon.at(-1).x}
              y1={currentPolygon.at(-1).y}
              x2={hoverPoint.x}
              y2={hoverPoint.y}
              stroke="red"
              strokeDasharray="4"
              strokeWidth={2}
            />
          )}
          {currentPolygon.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={5}
              fill="white"
              stroke="red"
              strokeWidth={2}
              onMouseDown={(e) => onStartDragPoint(e, -1, i)}
              style={{ cursor: "grab" }}
            />
          ))}
        </>
      )}
    </svg>
  );
}
