'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Edge {
  from: number;
  to: number;
}

interface TravelingPulse {
  fromId: number;
  toId: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export function NetworkGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Create 45 Nodes
    const nodes: Node[] = [];
    const numNodes = 45;
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 2,
        color: i % 4 === 0 ? '#d97706' : '#0d9488',
      });
    }

    // Build Graph Edges based on distance threshold
    const getEdges = (): Edge[] => {
      const edges: Edge[] = [];
      const distThreshold = 180;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < distThreshold) {
            edges.push({ from: i, to: j });
          }
        }
      }
      return edges;
    };

    // Active Traveling Pulses
    const pulses: TravelingPulse[] = [];

    // Periodically spawn traveling pulses between 2 random connected nodes
    const spawnPulse = () => {
      const edges = getEdges();
      if (edges.length === 0) return;
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      
      // Randomize travel direction (A -> B or B -> A)
      const forward = Math.random() > 0.5;
      pulses.push({
        fromId: forward ? randomEdge.from : randomEdge.to,
        toId: forward ? randomEdge.to : randomEdge.from,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: Math.random() > 0.4 ? '#14b8a6' : '#fbbf24',
      });
    };

    // Spawn initial pulses & set interval
    for (let k = 0; k < 5; k++) spawnPulse();
    const intervalId = setInterval(spawnPulse, 700);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update Node Positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off screen boundaries
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse Parallax Influence
        const dx = mouseRef.current.x - n.x;
        const dy = mouseRef.current.y - n.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        if (mouseDist < 120) {
          n.x -= (dx / mouseDist) * 0.5;
          n.y -= (dy / mouseDist) * 0.5;
        }
      });

      const edges = getEdges();

      // Draw Graph Edges
      edges.forEach((e) => {
        const n1 = nodes[e.from];
        const n2 = nodes[e.to];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, 1 - dist / 180) * 0.18;

        ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      });

      // Update & Render Traveling Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const nFrom = nodes[p.fromId];
        const nTo = nodes[p.toId];
        if (!nFrom || !nTo) continue;

        // Current pulse coordinates
        const px = nFrom.x + (nTo.x - nFrom.x) * p.progress;
        const py = nFrom.y + (nTo.y - nFrom.y) * p.progress;

        // Draw Glowing Connecting Line Segment
        const prevP = Math.max(0, p.progress - 0.2);
        const prevPx = nFrom.x + (nTo.x - nFrom.x) * prevP;
        const prevPy = nFrom.y + (nTo.y - nFrom.y) * prevP;

        const grad = ctx.createLinearGradient(prevPx, prevPy, px, py);
        grad.addColorStop(0, 'rgba(20, 184, 166, 0)');
        grad.addColorStop(1, p.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Draw Traveling Glowing Orb Particle
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw Nodes
      nodes.forEach((n) => {
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(intervalId);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
