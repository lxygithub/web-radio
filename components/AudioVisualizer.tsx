"use client";

import { useEffect, useRef, useCallback } from "react";

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

/**
 * Fake audio visualizer — generates smooth animated bars that react to play/pause.
 * Uses requestAnimationFrame for smooth 60fps animation without Web Audio API
 * (which requires CORS access to the audio stream).
 */
export default function AudioVisualizer({ isPlaying, barCount = 32, className = "" }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const heightsRef = useRef<number[]>([]);
  const targetsRef = useRef<number[]>([]);

  const initHeights = useCallback(() => {
    heightsRef.current = Array(barCount).fill(0);
    targetsRef.current = Array(barCount).fill(0);
  }, [barCount]);

  useEffect(() => {
    initHeights();
  }, [initHeights]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update targets periodically
      if (isPlaying) {
        for (let i = 0; i < barCount; i++) {
          if (Math.random() < 0.08) {
            targetsRef.current[i] = 0.2 + Math.random() * 0.8;
          }
        }
      } else {
        for (let i = 0; i < barCount; i++) {
          targetsRef.current[i] = 0;
        }
      }

      const barWidth = (rect.width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        const target = targetsRef.current[i] ?? 0;
        heightsRef.current[i] += (target - heightsRef.current[i]) * 0.15;

        const h = heightsRef.current[i] * rect.height;
        const x = i * (barWidth + 2);
        const y = rect.height - h;

        const gradient = ctx.createLinearGradient(x, y, x, rect.height);
        gradient.addColorStop(0, "rgba(0, 212, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 212, 255, 0.15)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
}
