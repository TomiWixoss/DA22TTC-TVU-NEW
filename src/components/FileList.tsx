"use client";
import React, { useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useFileList } from "./hooks/file-list";
import { FileListProps } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Folder,
  File,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  ArrowUpDown,
  LayoutGrid,
  List,
  MoreVertical,
  Copy,
  Download,
  Trash2,
  UploadCloud,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export default function FileList({
  files,
  isLoading,
  currentFolderId,
  currentFolderName,
  folderPath = [],
  onFolderClick,
  onBreadcrumbClick,
  onBackClick,
  onDownload,
  onUploadFile,
  onUploadFolder,
  onCheckFolderContent,
  onDelete,
}: FileListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const {
    files: sortedFiles,
    uniqueExtensions,
    showFolders,
    setSortCriteria,
    setSelectedExtension,
    setShowFolders,
    isGridView,
    setIsGridView,
    isDragging,
    compressingFolder,
    compressionProgress,
    showDeleteModal,
    deletePassword,
    fileToDelete,
    isDeleting,
    isAdminMode,
    handleMouseLeave,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
    generateDownloadLink,
    handleDownloadFolder,
    handleDelete,
    confirmDelete,
    selectedExtension,
    sortCriteria,
    SortCriteria,
    formatFileSize,
    setDeletePassword,
    setShowDeleteModal,
    setFileToDelete,
  } = useFileList({
    files,
    isLoading,
    currentFolderId,
    currentFolderName,
    folderPath,
    onFolderClick,
    onBreadcrumbClick,
    onBackClick,
    onDownload,
    onUploadFile,
    onUploadFolder,
    onCheckFolderContent,
    onDelete,
  });

  // Animate files on load
  useEffect(() => {
    if (!isLoading && gridRef.current && sortedFiles.length > 0) {
      const items = gridRef.current.querySelectorAll(".file-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: "power3.out",
        }
      );
    }
  }, [isLoading, sortedFiles, isGridView]);

  // Toolbar animation
  useEffect(() => {
    if (toolbarRef.current) {
      gsap.fromTo(
        toolbarRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  const handleFileHover = (e: React.MouseEvent, enter: boolean) => {
    if (enter) {
      gsap.to(e.currentTarget, {
        y: -2,
        duration: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(e.currentTarget, {
        y: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleFileClick = (fileId: string, mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      // Animate click
      gsap.to(`[data-file-id="${fileId}"]`, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => onFolderClick(fileId),
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col overflow-hidden bg-background relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-background/98 border-2 border-dashed border-foreground/20 flex items-center justify-center z-50">
          <div className="text-center">
            <UploadCloud className="mx-auto w-16 h-16 text-muted-foreground mb-6 animate-bounce" />
            <p className="text-lg font-light text-muted-foreground">Thả file để tải lên</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div ref={toolbarRef} className="border-b px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        {currentFolderId && (
          <div className="flex items-center gap-2 text-sm mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => onBackClick()}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0 hover:underline underline-offset-4"
            >
              DA22TTC
            </button>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                <button
                  onClick={() => onBreadcrumbClick(folder.id, index)}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px] hover:underline underline-offset-4"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
            {currentFolderName && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                <span className="text-foreground font-medium truncate max-w-[150px]">{currentFolderName}</span>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {currentFolderId && (
              <button
                onClick={() => {
                  gsap.to(".back-btn", {
                    x: -4,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 1,
                    onComplete: onBackClick,
                  });
                }}
                className="back-btn flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
            )}
            
            {!isLoading && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {sortedFiles.length} mục
              </span>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-1">
              {/* Toggle Folders */}
              <button
                onClick={() => setShowFolders(!showFolders)}
                className={cn(
                  "p-2.5 transition-all duration-200",
                  showFolders ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title={showFolders ? "Ẩn thư mục" : "Hiện thư mục"}
              >
                {showFolders ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 p-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">
                      {selectedExtension ? `.${selectedExtension}` : "Loại"}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-none border-border">
                  <DropdownMenuItem onClick={() => setSelectedExtension(null)} className="text-sm">
                    <Check className={cn("mr-2 w-3 h-3", !selectedExtension ? "opacity-100" : "opacity-0")} />
                    Tất cả
                  </DropdownMenuItem>
                  {uniqueExtensions.map((ext) => (
                    <DropdownMenuItem key={ext} onClick={() => setSelectedExtension(ext)} className="text-sm">
                      <Check className={cn("mr-2 w-3 h-3", selectedExtension === ext ? "opacity-100" : "opacity-0")} />
                      .{ext}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 p-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Sắp xếp</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-none border-border">
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Default)} className="text-sm">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Default ? "opacity-100" : "opacity-0")} />
                    Mặc định
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Name)} className="text-sm">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Name ? "opacity-100" : "opacity-0")} />
                    Tên
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Size)} className="text-sm">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Size ? "opacity-100" : "opacity-0")} />
                    Dung lượng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortCriteria(SortCriteria.Date)} className="text-sm">
                    <Check className={cn("mr-2 w-3 h-3", sortCriteria === SortCriteria.Date ? "opacity-100" : "opacity-0")} />
                    Ngày tạo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <button
                onClick={() => {
                  gsap.to(".view-toggle", {
                    rotate: 180,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                      gsap.set(".view-toggle", { rotate: 0 });
                      setIsGridView(!isGridView);
                    },
                  });
                }}
                className="view-toggle p-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isGridView ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 lg:p-8">
            <div className={cn(
              isGridView 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                : "space-y-2"
            )}>
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-muted/30 p-5 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted/50 rounded" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted/50 mb-2 rounded" />
                      <div className="h-3 w-20 bg-muted/50 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : sortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-24">
            <Folder className="w-16 h-16 text-muted-foreground/30 mb-6" />
            <p className="text-lg font-light text-muted-foreground mb-2">Thư mục trống</p>
            <p className="text-sm text-muted-foreground/60">Kéo thả file vào đây để tải lên</p>
          </div>
        ) : (
          <div ref={gridRef} className="p-6 lg:p-8">
            {isGridView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFiles.map((file) => (
                  <article
                    key={file.id}
                    data-file-id={file.id}
                    className={cn(
                      "file-item group bg-card border border-border p-5 cursor-pointer transition-all duration-200",
                      "hover:border-foreground/20",
                      file.isUploading && "opacity-60 pointer-events-none"
                    )}
                    onClick={() => handleFileClick(file.id, file.mimeType)}
                    onMouseEnter={(e) => handleFileHover(e, true)}
                    onMouseLeave={(e) => {
                      handleFileHover(e, false);
                      handleMouseLeave();
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      {file.mimeType === "application/vnd.google-apps.folder" ? (
                        <Folder className="w-10 h-10 text-foreground transition-transform group-hover:scale-105" />
                      ) : (
                        <File className="w-10 h-10 text-muted-foreground transition-transform group-hover:scale-105" />
                      )}

                      {!file.isUploading && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-none border-border">
                            {file.mimeType !== "application/vnd.google-apps.folder" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(generateDownloadLink(file.id));
                                  toast.success("Đã sao chép link");
                                }}
                                className="text-sm"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Sao chép link
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                file.mimeType === "application/vnd.google-apps.folder"
                                  ? handleDownloadFolder(file.id, file.name)
                                  : onDownload(file.id, file.name);
                              }}
                              className="text-sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Tải xuống
                            </DropdownMenuItem>
                            {isAdminMode && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-sm text-destructive focus:text-destructive"
                                  onClick={(e) => handleDelete(e, file)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className="text-sm font-medium truncate mb-2 group-hover:text-primary transition-colors">{file.name}</div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(file.createdTime).toLocaleDateString("vi-VN")}</span>
                      {file.size && <span className="tabular-nums">{formatFileSize(file.size)}</span>}
                    </div>

                    {(file.isUploading || compressingFolder === file.id) && (
                      <div className="mt-4">
                        <div className="h-1 bg-muted overflow-hidden">
                          <div
                            className="h-full bg-foreground transition-all duration-300"
                            style={{ width: `${file.isUploading ? file.uploadProgress : compressionProgress}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right mt-1 tabular-nums">
                          {file.isUploading ? file.uploadProgress : compressionProgress}%
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-border divide-y divide-border">
                {sortedFiles.map((file) => (
                  <article
                    key={file.id}
                    data-file-id={file.id}
                    className={cn(
                      "file-item group flex items-center gap-5 p-4 cursor-pointer transition-all duration-200",
                      "hover:bg-muted/30",
                      file.isUploading && "opacity-60 pointer-events-none"
                    )}
                    onClick={() => handleFileClick(file.id, file.mimeType)}
                    onMouseEnter={(e) => handleFileHover(e, true)}
                    onMouseLeave={(e) => {
                      handleFileHover(e, false);
                      handleMouseLeave();
                    }}
                  >
                    {file.mimeType === "application/vnd.google-apps.folder" ? (
                      <Folder className="w-6 h-6 text-foreground shrink-0" />
                    ) : (
                      <File className="w-6 h-6 text-muted-foreground shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{file.name}</div>
                    </div>

                    <div className="hidden sm:flex items-center gap-8 text-xs text-muted-foreground shrink-0">
                      <span className="w-24">{new Date(file.createdTime).toLocaleDateString("vi-VN")}</span>
                      <span className="w-20 text-right tabular-nums">{file.size ? formatFileSize(file.size) : "—"}</span>
                    </div>

                    {!file.isUploading && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1.5 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-none border-border">
                          {file.mimeType !== "application/vnd.google-apps.folder" && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(generateDownloadLink(file.id));
                                toast.success("Đã sao chép link");
                              }}
                              className="text-sm"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Sao chép link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              file.mimeType === "application/vnd.google-apps.folder"
                                ? handleDownloadFolder(file.id, file.name)
                                : onDownload(file.id, file.name);
                            }}
                            className="text-sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          {isAdminMode && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-sm text-destructive focus:text-destructive"
                                onClick={(e) => handleDelete(e, file)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {(file.isUploading || compressingFolder === file.id) && (
                      <div className="w-24 shrink-0">
                        <div className="h-1 bg-muted overflow-hidden">
                          <div
                            className="h-full bg-foreground transition-all duration-300"
                            style={{ width: `${file.isUploading ? file.uploadProgress : compressionProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md rounded-none border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal">Xóa vĩnh viễn</DialogTitle>
            <DialogDescription className="text-sm">
              Xóa &quot;{fileToDelete?.name}&quot;? Không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Mật khẩu admin"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="rounded-none border-border"
          />
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword("");
                setFileToDelete(null);
              }}
              className="rounded-none"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting || !deletePassword}
              className="rounded-none"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
