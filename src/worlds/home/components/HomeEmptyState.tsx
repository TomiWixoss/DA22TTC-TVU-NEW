"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { TechButton, PulseRing } from "@/shared/components/tech";
import { FolderTechIcon, UploadTechIcon } from "@/shared/components/icons/TechIcons";
import { FolderPlus, Upload } from "lucide-react";

interface HomeEmptyStateProps {
  onCreateFolder: () => void;
  onUploadFile: () => void;
}

export const HomeEmptyState: React.FC<HomeEmptyStateProps> = ({
  onCreateFolder,
  onUploadFile,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={containerRef} className="py-24 text-center relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <PulseRing color="#00ff88" size={300} rings={5} speed={4} />
      </div>

      <div className="relative z-10">
        <div className="w-24 h-24 mx-auto mb-8 border-2 border-[#00ff88]/30 flex items-center justify-center">
          <FolderTechIcon size={48} className="text-[#00ff88]/50" />
        </div>

        <h3 className="text-xl font-mono text-muted-foreground mb-2">
          EMPTY_DIRECTORY
        </h3>
        <p className="text-sm font-mono text-muted-foreground/60 mb-8 max-w-md mx-auto">
          Thư mục này chưa có file nào. Bắt đầu bằng cách tạo thư mục mới hoặc tải file lên.
        </p>

        <div className="flex items-center justify-center gap-4">
          <TechButton
            variant="secondary"
            onClick={onCreateFolder}
            icon={<FolderPlus className="w-4 h-4" />}
            className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black"
          >
            <span className="font-mono text-xs">NEW_FOLDER</span>
          </TechButton>

          <TechButton
            variant="primary"
            onClick={onUploadFile}
            icon={<Upload className="w-4 h-4" />}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
          >
            <span className="font-mono text-xs">UPLOAD_FILE</span>
          </TechButton>
        </div>
      </div>
    </div>
  );
};

export default HomeEmptyState;
