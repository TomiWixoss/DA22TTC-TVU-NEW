"use client";
import React, { useRef, useEffect } from "react";
import { DriveInfo } from "../types";
import { FolderPlus, FileUp, FolderUp, HardDrive, X } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface SidebarProps {
  driveInfo: DriveInfo | null;
  onCreateFolder: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatBytes: (bytes: number) => string;
  isOpen: boolean;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

export default function Sidebar({
  driveInfo,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  formatBytes,
  isOpen,
  onClose,
  fileInputRef,
  isLoading = false,
}: SidebarProps) {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const storageRef = useRef<HTMLDivElement>(null);
  const storageBarRef = useRef<HTMLDivElement>(null);

  const storagePercent = driveInfo ? (driveInfo.used / driveInfo.total) * 100 : 0;

  // Initial mount animation
  useEffect(() => {
    if (!isLoading && navItemsRef.current) {
      const items = navItemsRef.current.querySelectorAll(".nav-item");
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [isLoading]);

  // Storage bar animation
  useEffect(() => {
    if (driveInfo && storageBarRef.current) {
      gsap.fromTo(
        storageBarRef.current,
        { scaleX: 0 },
        {
          scaleX: storagePercent / 100,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        }
      );
    }
  }, [driveInfo, storagePercent]);

  const handleCreateFolder = () => {
    onClose();
    onCreateFolder();
  };

  const handleItemHover = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, {
      x: enter ? 4 : 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/90 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed md:sticky top-0 md:top-16 w-64 bg-background border-r z-50",
          "flex flex-col h-screen md:h-[calc(100vh-64px)]",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-5 border-b md:hidden">
          <span className="text-sm font-medium tracking-tight">Menu</span>
          <button 
            onClick={onClose} 
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-11 bg-muted/50 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <nav ref={navItemsRef} className="space-y-1">
              <button
                onClick={handleCreateFolder}
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="nav-item w-full flex items-center gap-3 px-3 py-3 text-sm text-left hover:bg-muted/50 transition-colors group"
              >
                <FolderPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Tạo thư mục</span>
                <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">⌘N</span>
              </button>

              <label
                htmlFor="fileInput"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="nav-item w-full flex items-center gap-3 px-3 py-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors group"
              >
                <FileUp className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Tải file lên</span>
                <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">⌘U</span>
              </label>

              <label
                htmlFor="folderInput"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="nav-item w-full flex items-center gap-3 px-3 py-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors group"
              >
                <FolderUp className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Tải thư mục lên</span>
              </label>

              <div className="nav-item pt-6 mt-6 border-t">
                <div className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground">
                  <HardDrive className="w-4 h-4" />
                  <span>DA22TTC</span>
                </div>
              </div>
            </nav>
          )}

          {/* Hidden Inputs */}
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={(e) => {
              onUploadFile(e);
              onClose();
            }}
            className="hidden"
            ref={fileInputRef}
          />
          <input
            id="folderInput"
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={(e) => {
              onUploadFolder(e);
              onClose();
            }}
            className="hidden"
            ref={folderInputRef}
          />
        </div>

        {/* Storage Info */}
        {driveInfo && !isLoading && (
          <div ref={storageRef} className="p-5 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Bộ nhớ</span>
              <span className="tabular-nums">{storagePercent.toFixed(1)}%</span>
            </div>
            <div className="h-1 bg-muted overflow-hidden">
              <div
                ref={storageBarRef}
                className="h-full bg-foreground origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{formatBytes(driveInfo.remaining)}</span> còn trống
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-5 border-t">
            <div className="h-3 w-16 bg-muted/50 animate-pulse mb-3" />
            <div className="h-1 bg-muted/50" />
            <div className="h-3 w-24 bg-muted/50 animate-pulse mt-3" />
          </div>
        )}
      </aside>
    </>
  );
}
