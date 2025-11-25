"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FileText, Search, Sparkles, Sun, Moon, RefreshCw } from "lucide-react";
import gsap from "gsap";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAISearch: boolean;
  onToggleAISearch: () => void;
  onSearch: () => void;
  onReloadCache?: () => void;
  isReloading?: boolean;
}

export default function Header({
  searchTerm,
  onSearchChange,
  isAISearch,
  onToggleAISearch,
  onSearch,
  onReloadCache,
  isReloading,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
      );
      
      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" }
      );
      
      gsap.fromTo(
        actionsRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Search focus animation
  useEffect(() => {
    if (underlineRef.current) {
      gsap.to(underlineRef.current, {
        scaleX: searchFocused ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [searchFocused]);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Animate theme icon
    gsap.to(".theme-icon", {
      rotate: 360,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(".theme-icon", { rotate: 0 });
      },
    });
    
    setTheme(newTheme);
  };

  const handleNavClick = () => {
    gsap.to(".nav-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
    router.push("/txt");
  };

  return (
    <header ref={headerRef} className="border-b bg-background relative overflow-hidden">
      {/* Animated background line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border">
        <div 
          className="h-full bg-foreground origin-left"
          style={{ transform: "scaleX(0)" }}
          ref={(el) => {
            if (el) {
              gsap.to(el, {
                scaleX: 1,
                duration: 0.8,
                delay: 0.3,
                ease: "power3.inOut",
              });
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between h-16 px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <span 
            ref={logoRef}
            className="text-sm font-medium tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { letterSpacing: "0.05em", duration: 0.3 });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { letterSpacing: "0", duration: 0.3 });
            }}
          >
            DA22TTC
          </span>
        </div>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={isAISearch ? "Tìm kiếm bằng AI..." : "Tìm kiếm tài liệu..."}
              className="w-full bg-transparent pl-6 pr-20 py-3 text-sm outline-none placeholder:text-muted-foreground/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
            />
            
            {/* Animated underline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-muted-foreground/20">
              <div 
                ref={underlineRef}
                className="h-full bg-foreground origin-center"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {isAISearch && (
                <button
                  onClick={onSearch}
                  className="text-xs font-medium text-foreground hover:opacity-70 transition-opacity"
                >
                  Tìm
                </button>
              )}
              <button
                onClick={() => {
                  gsap.to(".ai-icon", {
                    scale: 1.2,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 1,
                  });
                  onToggleAISearch();
                }}
                className={`ai-icon p-1.5 transition-colors ${
                  isAISearch ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                title={isAISearch ? "Đang dùng AI" : "Chuyển sang AI"}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div ref={actionsRef} className="flex items-center gap-2">
          {onReloadCache && (
            <button
              onClick={() => {
                if (!isReloading) {
                  gsap.to(".reload-icon", {
                    rotate: 360,
                    duration: 0.6,
                    ease: "power2.inOut",
                  });
                  onReloadCache();
                }
              }}
              disabled={isReloading}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              title="Tải lại"
            >
              <RefreshCw className={`reload-icon w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
            </button>
          )}

          <button
            onClick={handleThemeToggle}
            className="theme-icon p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            title={theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={handleNavClick}
            className="nav-btn flex items-center gap-2 ml-4 px-4 py-2 text-sm border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            <FileText className="w-4 h-4" />
            <span>Ghi chú</span>
          </button>
        </div>
      </div>
    </header>
  );
}
