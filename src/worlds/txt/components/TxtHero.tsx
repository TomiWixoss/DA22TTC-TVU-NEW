"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GlitchText, TypeWriter, TechBadge, PulseRing, WaveformVisualizer } from "@/shared/components/tech";
import { TerminalIcon } from "@/shared/components/icons/TechIcons";

interface TxtHeroProps {
  totalNotes: number;
}

export const TxtHero: React.FC<TxtHeroProps> = ({ totalNotes }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [heroComplete, setHeroComplete] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger animation for hero elements
      gsap.fromTo(
        ".hero-element",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          onComplete: () => {
            setHeroComplete(true);
            setTimeout(() => setShowStats(true), 500);
          },
        }
      );

      // Floating animation for decorative elements
      gsap.to(".float-element", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-36 pb-20 px-6 lg:px-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 float-element opacity-20">
        <PulseRing color="#00ff88" size={150} rings={4} speed={3} />
      </div>
      <div className="absolute bottom-10 left-10 float-element opacity-10">
        <PulseRing color="#00aaff" size={100} rings={3} speed={4} />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="max-w-3xl">
          {/* Status badges */}
          <div className="hero-element flex items-center gap-3 mb-8">
            <TechBadge variant="success" pulse>
              SYSTEM_ONLINE
            </TechBadge>
            <TechBadge variant="info">
              v2.0.0
            </TechBadge>
          </div>

          {/* Main title */}
          <div className="hero-element mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border-2 border-[#00ff88] flex items-center justify-center">
                <TerminalIcon size={24} className="text-[#00ff88]" />
              </div>
              <div className="h-px flex-1 bg-linear-to-r from-[#00ff88] to-transparent" />
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] font-mono">
              {heroComplete ? (
                <GlitchText intensity="low">TXT://</GlitchText>
              ) : (
                <TypeWriter 
                  text="TXT://" 
                  speed={80} 
                  cursor={false} 
                  onComplete={() => setHeroComplete(true)} 
                />
              )}
              <br />
              <span className="text-muted-foreground text-5xl md:text-6xl lg:text-7xl">
                STORAGE
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="hero-element text-base text-muted-foreground font-mono leading-relaxed mb-8 max-w-xl">
            Hệ thống lưu trữ văn bản, code snippets và ghi chú với khả năng 
            highlight syntax tự động và tìm kiếm nhanh.
          </p>

          {/* Stats */}
          {showStats && (
            <div className="hero-element flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#00ff88]" />
                <div>
                  <div className="text-3xl font-mono font-bold text-[#00ff88]">
                    {totalNotes}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground tracking-wider">
                    TOTAL_RECORDS
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <WaveformVisualizer 
                  color="#00ff88" 
                  bars={12} 
                  height={32} 
                  active={true} 
                />
                <div className="text-[10px] font-mono text-muted-foreground">
                  ACTIVE
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TxtHero;
