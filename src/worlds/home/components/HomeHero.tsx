"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GlitchText, TypeWriter, TechBadge, PulseRing, AnimatedCounter, WaveformVisualizer } from "@/shared/components/tech";
import { StorageTechIcon, ChipIcon } from "@/shared/components/icons/TechIcons";
import { DriveInfo } from "@/shared/types";

interface HomeHeroProps {
  driveInfo: DriveInfo | null;
  totalFiles: number;
  isLoading: boolean;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  driveInfo,
  totalFiles,
  isLoading,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const [heroComplete, setHeroComplete] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: () => setHeroComplete(true),
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const storagePercent = driveInfo ? (driveInfo.used / driveInfo.total) * 100 : 0;

  return (
    <section ref={heroRef} className="relative py-12 px-6 lg:px-8 border-b border-border overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <PulseRing color="#00ff88" size={200} rings={4} speed={4} />
      </div>

      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left side - Title */}
          <div className="flex-1">
            <div className="hero-item flex items-center gap-3 mb-4">
              <TechBadge variant="success" pulse size="sm">
                SYSTEM_ACTIVE
              </TechBadge>
              <TechBadge variant="info" size="sm">
                v2.0.0
              </TechBadge>
            </div>

            <h1 className="hero-item text-4xl lg:text-5xl font-light font-mono tracking-tight mb-4">
              {heroComplete ? (
                <GlitchText intensity="low">TomiSakaeTech</GlitchText>
              ) : (
                <TypeWriter text="TomiSakaeTech" speed={80} cursor={false} onComplete={() => setHeroComplete(true)} />
              )}
              <span className="text-muted-foreground text-2xl lg:text-3xl block mt-2">
                FILE_SYSTEM
              </span>
            </h1>

            <p className="hero-item text-sm text-muted-foreground font-mono max-w-md">
              Hệ thống quản lý và lưu trữ tài liệu với khả năng tìm kiếm AI và đồng bộ Google Drive.
            </p>
          </div>

          {/* Right side - Stats */}
          <div className="hero-item flex flex-wrap gap-6">
            {/* Files count */}
            <div className="flex items-center gap-4 p-4 border border-border bg-card/50">
              <div className="w-12 h-12 border border-[#00ff88] flex items-center justify-center">
                <StorageTechIcon size={24} className="text-[#00ff88]" />
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-[#00ff88]">
                  {isLoading ? (
                    <span className="animate-pulse">---</span>
                  ) : (
                    <AnimatedCounter value={totalFiles} duration={1} />
                  )}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-wider">
                  TOTAL_FILES
                </div>
              </div>
            </div>

            {/* Storage */}
            {driveInfo && (
              <div className="flex items-center gap-4 p-4 border border-border bg-card/50">
                <div className="w-12 h-12 border border-[#00aaff] flex items-center justify-center">
                  <ChipIcon size={24} className="text-[#00aaff]" />
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-[#00aaff]">
                    <AnimatedCounter value={storagePercent} duration={1.5} decimals={1} suffix="%" />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground tracking-wider">
                    STORAGE_USED
                  </div>
                </div>
              </div>
            )}

            {/* Activity */}
            <div className="flex items-center gap-4 p-4 border border-border bg-card/50">
              <WaveformVisualizer color="#00ff88" bars={8} height={48} active={!isLoading} />
              <div>
                <div className="text-sm font-mono text-[#00ff88]">ACTIVE</div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-wider">
                  SYSTEM_STATUS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
