"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { TechBadge } from "@/shared/components/tech";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface HomeBreadcrumbProps {
  currentFolderId: string | null;
  currentFolderName: string | null;
  folderPath: BreadcrumbItem[];
  onNavigate: (folderId: string | null, index?: number) => void;
  onBack: () => void;
}

export const HomeBreadcrumb: React.FC<HomeBreadcrumbProps> = ({
  currentFolderId,
  currentFolderName,
  folderPath,
  onNavigate,
  onBack,
}) => {
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!breadcrumbRef.current) return;

    gsap.fromTo(
      breadcrumbRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
    );
  }, [currentFolderId]);

  if (!currentFolderId) return null;

  return (
    <div ref={breadcrumbRef} className="flex items-center gap-4 mb-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-muted-foreground hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-all border border-transparent hover:border-[#00ff88]/30"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK</span>
      </button>

      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onNavigate(null)}
          className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-[#00ff88] transition-colors shrink-0"
        >
          <Home className="w-3 h-3" />
          <span>ROOT</span>
        </button>

        {folderPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            <button
              onClick={() => onNavigate(folder.id, index)}
              className="text-xs font-mono text-muted-foreground hover:text-[#00ff88] transition-colors truncate max-w-[120px]"
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}

        {currentFolderName && (
          <>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            <TechBadge variant="success" size="sm">
              {currentFolderName}
            </TechBadge>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeBreadcrumb;
