"use client";
import React, { useRef, useEffect, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  baseSize: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  // Movement
  vx: number;
  vy: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  active: boolean;
  opacity: number;
}

interface CosmicBackgroundProps {
  className?: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  // Initialize stars with movement
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    const starCount = Math.floor((width * height) / 2500);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseSize: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.3, // Dimmer by default
        twinkleSpeed: Math.random() * 3 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
        // Slow drift movement
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }
    starsRef.current = stars;
  }, []);

  // Initialize comets
  const initComets = useCallback(() => {
    const comets: Comet[] = [];
    for (let i = 0; i < 3; i++) {
      comets.push({
        x: -100, y: -100,
        vx: 0, vy: 0,
        length: 0,
        active: false,
        opacity: 0,
      });
    }
    cometsRef.current = comets;
  }, []);


  // Spawn a comet
  const spawnComet = useCallback((width: number, height: number) => {
    const inactiveComet = cometsRef.current.find(c => !c.active);
    if (!inactiveComet) return;

    const side = Math.floor(Math.random() * 2);
    if (side === 0) {
      inactiveComet.x = Math.random() * width;
      inactiveComet.y = -50;
    } else {
      inactiveComet.x = -50;
      inactiveComet.y = Math.random() * height * 0.5;
    }

    const speed = Math.random() * 8 + 6;
    const angle = Math.random() * 0.5 + 0.3;
    inactiveComet.vx = Math.cos(angle) * speed;
    inactiveComet.vy = Math.sin(angle) * speed;
    inactiveComet.length = Math.random() * 100 + 80;
    inactiveComet.active = true;
    inactiveComet.opacity = 1;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    initComets();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Draw star with twinkle size and mouse reveal
    const drawStar = (star: Star, time: number, width: number, height: number) => {
      // Update position (slow drift)
      star.x += star.vx;
      star.y += star.vy;

      // Wrap around screen
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      // Twinkle - affects both brightness AND size
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const twinkleFactor = twinkle * 0.5 + 0.5; // 0 to 1
      
      // Size pulses with twinkle
      const currentSize = star.baseSize * (0.6 + twinkleFactor * 0.8);
      
      // Base brightness with twinkle
      let alpha = star.brightness * (0.4 + twinkleFactor * 0.6);

      // Mouse proximity - REVEALS stars more clearly
      const dx = star.x - mouseRef.current.x;
      const dy = star.y - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseRadius = 180;
      
      let mouseBoost = 0;
      let sizeBoost = 1;
      
      if (dist < mouseRadius) {
        const proximity = 1 - dist / mouseRadius;
        mouseBoost = proximity * 0.8; // Significantly brighter
        sizeBoost = 1 + proximity * 0.6; // Slightly larger
        alpha = Math.min(alpha + mouseBoost, 1);
      }

      const finalSize = currentSize * sizeBoost;


      // Outer glow - more visible when mouse is near
      const glowSize = finalSize * (3 + mouseBoost * 3);
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(200, 220, 255, ${alpha * 0.4})`);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha * 1.2, 1)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, finalSize * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw comet
    const drawComet = (comet: Comet) => {
      if (!comet.active) return;

      const speed = Math.sqrt(comet.vx * comet.vx + comet.vy * comet.vy);
      const tailX = -comet.vx / speed * comet.length;
      const tailY = -comet.vy / speed * comet.length;

      // Tail gradient
      const gradient = ctx.createLinearGradient(
        comet.x, comet.y,
        comet.x + tailX, comet.y + tailY
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${comet.opacity})`);
      gradient.addColorStop(0.1, `rgba(180, 220, 255, ${comet.opacity * 0.7})`);
      gradient.addColorStop(0.5, `rgba(100, 180, 255, ${comet.opacity * 0.3})`);
      gradient.addColorStop(1, "transparent");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(comet.x, comet.y);
      ctx.lineTo(comet.x + tailX, comet.y + tailY);
      ctx.stroke();

      // Head glow
      const headGradient = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 12);
      headGradient.addColorStop(0, `rgba(255, 255, 255, ${comet.opacity})`);
      headGradient.addColorStop(0.4, `rgba(200, 230, 255, ${comet.opacity * 0.5})`);
      headGradient.addColorStop(1, "transparent");

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(comet.x, comet.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `rgba(255, 255, 255, ${comet.opacity})`;
      ctx.beginPath();
      ctx.arc(comet.x, comet.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    };


    // Animation loop
    let lastCometTime = 0;
    const animate = (time: number) => {
      // Pure black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all stars
      const timeInSeconds = time / 1000;
      starsRef.current.forEach(star => drawStar(star, timeInSeconds, canvas.width, canvas.height));

      // Spawn comets randomly (every 4-8 seconds)
      if (time - lastCometTime > 4000 && Math.random() < 0.015) {
        spawnComet(canvas.width, canvas.height);
        lastCometTime = time;
      }

      // Update and draw comets
      cometsRef.current.forEach(comet => {
        if (comet.active) {
          comet.x += comet.vx;
          comet.y += comet.vy;

          if (comet.x > canvas.width + 150 || comet.y > canvas.height + 150) {
            comet.active = false;
          }

          drawComet(comet);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initStars, initComets, spawnComet]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0, background: "#000000" }}
    />
  );
};
