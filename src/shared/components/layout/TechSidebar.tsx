"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DriveInfo } from "@/shared/types";
import { TechProgress, StatusIndicator } from "@/shared/components/tech";
import { StorageTechIcon } from "@/shared/components/icons/TechIcons";
import { FolderPlus, FileUp, FolderUp, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface TechSidebarProps {
  driveInfo: DriveInfo | null;
  onCreateFolder: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatBytes: (bytes: number) => string;
  isOpen: boolean;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isLoading?: boolean;
}

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1], // power3.out equivalent
    },
  }),
};

export const TechSidebar: React.FC<TechSidebarProps> = ({
  driveInfo,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  formatBytes,
  isOpen,
  onClose,
  fileInputRef,
  isLoading = false,
}) => {
  const folderInputRef = useRef<HTMLInputElement>(null);

  const storagePercent = driveInfo ? (driveInfo.used / driveInfo.total) * 100 : 0;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/90 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "w-72 bg-background border-r border-border z-50 shrink-0",
          "flex flex-col h-full",
          "fixed md:relative top-0 left-0",
          "md:h-auto",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <span className="text-xs font-mono tracking-wider text-muted-foreground">
            MENU
          </span>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-4 py-3 border-b border-border/50">
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
            ACTIONS
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-muted/30 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <nav className="space-y-1">
              <motion.button
                custom={0}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  onClose();
                  onCreateFolder();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors group"
              >
                <FolderPlus className="w-4 h-4 text-muted-foreground group-hover:text-[#00ff88] transition-colors" />
                <span className="font-mono text-xs">NEW_FOLDER</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  ⌘N
                </span>
              </motion.button>

              <motion.label
                custom={1}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                transition={{ duration: 0.2 }}
                htmlFor="fileInput"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors group"
              >
                <FileUp className="w-4 h-4 text-muted-foreground group-hover:text-[#00ff88] transition-colors" />
                <span className="font-mono text-xs">UPLOAD_FILE</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  ⌘U
                </span>
              </motion.label>

              <motion.label
                custom={2}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                transition={{ duration: 0.2 }}
                htmlFor="folderInput"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors group"
              >
                <FolderUp className="w-4 h-4 text-muted-foreground group-hover:text-[#00ff88] transition-colors" />
                <span className="font-mono text-xs">UPLOAD_FOLDER</span>
              </motion.label>

              {/* Divider */}
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                className="my-4 border-t border-border/50"
              />

              {/* Drive info */}
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                className="px-4 py-3"
              >
                <div className="flex items-center gap-3 mb-3">
                  <StorageTechIcon size={16} className="text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">STORAGE</span>
                </div>
                <StatusIndicator status="online" size="sm" />
              </motion.div>
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
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-3">
              <span>DISK_USAGE</span>
              <span className="text-foreground">{storagePercent.toFixed(1)}%</span>
            </div>
            <TechProgress
              value={storagePercent}
              max={100}
              height="sm"
              color="#00ff88"
            />
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">FREE:</span>
              <span className="text-[#00ff88]">{formatBytes(driveInfo.remaining)}</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-4 border-t border-border">
            <div className="h-3 w-20 bg-muted/30 animate-pulse mb-3" />
            <div className="h-1 bg-muted/30" />
            <div className="h-3 w-28 bg-muted/30 animate-pulse mt-3" />
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/50">
          <span className="text-[9px] font-mono text-muted-foreground/50">
            TomiSakaeTech - SYSTEM
          </span>
        </div>
      </aside>
    </>
  );
};

export default TechSidebar;
