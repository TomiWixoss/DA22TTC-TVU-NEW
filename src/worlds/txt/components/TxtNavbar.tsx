"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { StatusIndicator, TechButton, TechBadge } from "@/shared/components/tech";
import { TerminalIcon } from "@/shared/components/icons/TechIcons";
import { ArrowLeft, Plus, Terminal } from "lucide-react";

interface TxtNavbarProps {
  totalNotes: number;
  onBack: () => void;
  onAdd: () => void;
}

export const TxtNavbar: React.FC<TxtNavbarProps> = ({
  totalNotes,
  onBack,
  onAdd,
}) => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xs border-b border-border">
      {/* Top status bar */}
      <div className="border-b border-[#00ff88]/20 bg-[#00ff88]/5">
        <div className="max-w-[1400px] mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <StatusIndicator status="online" label="TXT_MODULE" size="sm" />
              <div className="h-3 w-px bg-border" />
              <TechBadge variant="success" size="sm">
                {totalNotes} RECORDS
              </TechBadge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-muted-foreground font-mono animate-pulse">
                ● LIVE
              </span>
              <TerminalIcon size={14} className="text-[#00ff88]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-14">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-[#00ff88] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK_TO_HOME</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#00ff88] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#00ff88]" />
            </div>
            <div>
              <span className="text-sm font-mono font-bold">TXT://</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-2">STORAGE</span>
            </div>
          </div>

          <TechButton
            variant="primary"
            size="sm"
            onClick={onAdd}
            icon={<Plus className="w-4 h-4" />}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
          >
            <span className="font-mono text-xs">NEW_NOTE</span>
          </TechButton>
        </div>
      </div>
    </nav>
  );
};

export default TxtNavbar;
