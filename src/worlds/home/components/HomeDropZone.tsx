"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { UploadTechIcon } from "@/shared/components/icons/TechIcons";
import { TechBadge, PulseRing } from "@/shared/components/tech";

interface HomeDropZoneProps {
  isVisible: boolean;
}

export const HomeDropZone: React.FC<HomeDropZoneProps> = ({ isVisible }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isVisible) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-background/98 border-2 border-dashed border-[#00ff88]/50 flex items-center justify-center z-50"
    >
      <div className="text-center relative">
        {/* Pulse rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
          <PulseRing color="#00ff88" size={200} rings={4} speed={2} />
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#00ff88] flex items-center justify-center animate-bounce">
            <UploadTechIcon size={40} className="text-[#00ff88]" />
          </div>

          <h3 className="text-2xl font-mono text-[#00ff88] mb-2">
            DROP_FILES_HERE
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <TechBadge variant="success" pulse>
              READY_TO_UPLOAD
            </TechBadge>
          </div>

          <p className="text-sm font-mono text-muted-foreground">
            Thả file hoặc thư mục để tải lên thư mục hiện tại
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeDropZone;
