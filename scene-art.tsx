"use client";

import { useState } from "react";
import { VIEW_H, VIEW_W, type SceneShape, type SpotScene } from "@/lib/spot-scenes";

function Shape({ shape }: { shape: SceneShape }) {
  const attrs = shape.attrs;
  switch (shape.tag) {
    case "circle":
      return <circle {...(attrs as React.SVGProps<SVGCircleElement>)} />;
    case "ellipse":
      return <ellipse {...(attrs as React.SVGProps<SVGEllipseElement>)} />;
    case "rect":
      return <rect {...(attrs as React.SVGProps<SVGRectElement>)} />;
    case "path":
      return <path {...(attrs as React.SVGProps<SVGPathElement>)} />;
    case "polygon":
      return <polygon {...(attrs as React.SVGProps<SVGPolygonElement>)} />;
    case "line":
      return <line {...(attrs as React.SVGProps<SVGLineElement>)} />;
    default:
      return null;
  }
}

export function SceneArt({
  scene,
  variant,
  found,
  hintId,
  onSpot,
}: {
  scene: SpotScene;
  variant: "left" | "right";
  found: string[];
  hintId: string | null;
  onSpot: (x: number, y: number) => void;
}) {
  const [cursor, setCursor] = useState({ x: VIEW_W / 2, y: VIEW_H / 2, visible: false });

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_W;
    const y = ((event.clientY - rect.top) / rect.height) * VIEW_H;
    onSpot(x, y);
  };

  const moveCursor = (dx: number, dy: number) => {
    setCursor((current) => ({
      x: Math.min(VIEW_W - 6, Math.max(6, current.x + dx)),
      y: Math.min(VIEW_H - 6, Math.max(6, current.y + dy)),
      visible: true,
    }));
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-ink shadow-soft">
        {variant === "left" ? "1-сурет" : "2-сурет"}
      </span>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full cursor-crosshair touch-manipulation rounded-3xl border-2 border-white shadow-soft focus-visible:outline-3 focus-visible:outline-grape"
        onClick={handleClick}
        role="img"
        aria-label={`${scene.title} — ${variant === "left" ? "бірінші" : "екінші"} сурет. Айырмашылығы бар жерді бас немесе бағыттауыш пернелермен жүріп, Enter бас.`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveCursor(-12, 0);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            moveCursor(12, 0);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            moveCursor(0, -12);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            moveCursor(0, 12);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (cursor.visible) onSpot(cursor.x, cursor.y);
          }
        }}
        onFocus={() => setCursor((current) => ({ ...current, visible: true }))}
      >
        <g>
          {scene.elements.map((element) => {
            if (element.only === "left" && variant === "right") return null;
            if (element.only === "right" && variant === "left") return null;
            const shapes = variant === "right" && element.rightShapes ? element.rightShapes : element.shapes;
            return (
              <g key={element.id}>
                {shapes.map((shape, index) => (
                  <Shape key={`${element.id}-${index}`} shape={shape} />
                ))}
              </g>
            );
          })}
        </g>

        {scene.differences.map((difference) => {
          const isFound = found.includes(difference.id);
          if (!isFound) return null;
          const radius = Math.max(13, difference.r * 0.66);
          return (
            <g key={difference.id}>
              <circle
                cx={difference.x}
                cy={difference.y}
                r={radius}
                fill="rgba(53,192,143,0.18)"
                stroke="#35C08F"
                strokeWidth={3}
              />
              <path
                d={`M${difference.x - 6} ${difference.y} l5 5 l8 -10`}
                fill="none"
                stroke="#1F9E74"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {hintId ? (
          (() => {
            const hint = scene.differences.find((difference) => difference.id === hintId);
            if (!hint) return null;
            return (
              <circle
                cx={hint.x}
                cy={hint.y}
                r={hint.r + 5}
                fill="none"
                stroke="#F7B23B"
                strokeWidth={3.5}
                strokeDasharray="7 7"
                className="animate-pulse"
              />
            );
          })()
        ) : null}

        {cursor.visible ? (
          <g pointerEvents="none">
            <circle cx={cursor.x} cy={cursor.y} r={11} fill="rgba(146,113,232,0.18)" stroke="#9271E8" strokeWidth={2.5} />
            <line x1={cursor.x - 16} y1={cursor.y} x2={cursor.x + 16} y2={cursor.y} stroke="#9271E8" strokeWidth={1.5} />
            <line x1={cursor.x} y1={cursor.y - 16} x2={cursor.x} y2={cursor.y + 16} stroke="#9271E8" strokeWidth={1.5} />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
