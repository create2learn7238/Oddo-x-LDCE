'use client';

import React, { useEffect, useRef } from 'react';

export function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouseRef.current.targetX = x * 2;
      mouseRef.current.targetY = y * 2;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let rotationX = 0;
    let rotationY = 0;

    // Generate 120 points on a sphere
    const points: { x: number; y: number; z: number; size: number; color: string }[] = [];
    const numPoints = 140;
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      const radius = 160;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        size: Math.random() * 2 + 1.5,
        color: i % 5 === 0 ? '#f59e0b' : '#14b8a6',
      });
    }

    const render = () => {
      // Smooth interpolation for mouse interaction
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      rotationY += 0.006 + mouseRef.current.x * 0.02;
      rotationX += mouseRef.current.y * 0.01;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Outer Atmosphere Ring Glow
      const grad = ctx.createRadialGradient(cx, cy, 120, cx, cy, 200);
      grad.addColorStop(0, 'rgba(20, 184, 166, 0.15)');
      grad.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();

      // Sort points by Z to draw back-to-front
      const transformed = points.map((p) => {
        // Rotate around Y
        let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
        let z1 = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);

        // Rotate around X
        let y2 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = p.y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        return { x: x1, y: y2, z: z2, size: p.size, color: p.color };
      });

      transformed.sort((a, b) => a.z - b.z);

      // Draw Latitude rings
      for (let lat = -60; lat <= 60; lat += 30) {
        const rad = (lat * Math.PI) / 180;
        const ringR = 160 * Math.cos(rad);
        const ringY = 160 * Math.sin(rad);

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          let rx = ringR * Math.cos(a);
          let rz = ringR * Math.sin(a);

          let x1 = rx * Math.cos(rotationY) - rz * Math.sin(rotationY);
          let z1 = rx * Math.sin(rotationY) + rz * Math.cos(rotationY);
          let y2 = ringY * Math.cos(rotationX) - z1 * Math.sin(rotationX);
          let z2 = ringY * Math.sin(rotationX) + z1 * Math.cos(rotationX);

          const px = cx + x1;
          const py = cy + y2;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Dots
      transformed.forEach((p) => {
        const alpha = Math.max(0.1, (p.z + 160) / 320);
        const scale = (p.z + 240) / 320;
        const px = cx + p.x;
        const py = cy + p.y;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full opacity-60 mix-blend-screen" />
    </div>
  );
}
