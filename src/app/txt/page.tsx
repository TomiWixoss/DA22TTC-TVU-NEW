"use client";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNote } from "../../components/hooks/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  X,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

const NotePage = () => {
  const {
    newNote,
    setNewNote,
    loading,
    expandedNotes,
    deleteMode,
    setDeleteMode,
    deleteCode,
    setDeleteCode,
    handleAddNote,
    handleDeleteNote,
    handleCopy,
    handleGoBack,
    toggleNoteExpansion,
    countLines,
    currentPage,
    totalPages,
    paginatedNotes,
    goToPage,
    searchQuery,
    setSearchQuery,
    filteredNotes,
  } = useNote();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = deleteMode ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [deleteMode]);

  const handleDownload = (content: string, timestamp: number) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ghi-chu-${new Date(timestamp).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Đã tải xuống");
  };

  const handleDownloadAll = () => {
    if (filteredNotes.length === 0) return;
    const allContent = filteredNotes
      .map((note, i) => `--- ${i + 1}. ${new Date(note.timestamp).toLocaleString("vi-VN")} ---\n${note.content}`)
      .join("\n\n");
    const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tat-ca-ghi-chu-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Đã xuất ${filteredNotes.length} ghi chú`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <span className="text-sm font-medium tracking-tight">txt/</span>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6">
              Kho<br />Văn Bản
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Không gian lưu trữ code, ghi chú và các đoạn văn bản của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-16 z-40 bg-background border-b">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4 gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full bg-transparent border-b border-transparent focus:border-foreground pl-6 pr-8 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownloadAll}
                disabled={filteredNotes.length === 0}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                Xuất tất cả
              </button>

              <span className="text-sm text-muted-foreground tabular-nums">
                {filteredNotes.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="px-6 lg:px-12 py-12">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
                : "divide-y divide-border"
            )}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-background p-8 animate-pulse">
                  <div className="h-3 w-24 bg-muted mb-6" />
                  <div className="h-20 bg-muted mb-4" />
                  <div className="h-3 w-16 bg-muted" />
                </div>
              ))}
            </div>
          ) : paginatedNotes.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground mb-8">
                {searchQuery ? "Không tìm thấy kết quả" : "Chưa có ghi chú nào"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
                >
                  Tạo ghi chú đầu tiên
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                  {paginatedNotes.map((note) => (
                    <article
                      key={note.id}
                      className={cn(
                        "group bg-background p-6 lg:p-8 flex flex-col",
                        deleteMode === note.id && "ring-1 ring-destructive ring-inset"
                      )}
                    >
                      {/* Meta */}
                      <div className="flex items-center justify-between mb-6">
                        <time className="text-xs text-muted-foreground tracking-wide uppercase">
                          {formatDate(note.timestamp)}
                        </time>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {formatTime(note.timestamp)}
                        </span>
                      </div>

                      {/* Code */}
                      <div className="flex-1 mb-6">
                        <div className="relative">
                          <pre
                            className={cn(
                              "overflow-x-auto",
                              !expandedNotes[note.id] && "max-h-[160px] overflow-y-hidden"
                            )}
                          >
                            <code
                              className="hljs block p-4 text-[13px] leading-relaxed rounded-none bg-[#0d1117]"
                              dangerouslySetInnerHTML={{
                                __html: hljs.highlightAuto(note.content).value,
                              }}
                            />
                          </pre>
                          {countLines(note.content) > 6 && !expandedNotes[note.id] && (
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent" />
                          )}
                        </div>
                        {countLines(note.content) > 6 && (
                          <button
                            onClick={() => toggleNoteExpansion(note.id)}
                            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {expandedNotes[note.id] ? "Thu gọn" : "Xem thêm"}
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(note.content)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Sao chép
                        </button>
                        <button
                          onClick={() => handleDownload(note.content, note.timestamp)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Tải xuống
                        </button>
                        <button
                          onClick={() => { setDeleteMode(note.id); setDeleteCode(""); }}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
                        >
                          Xóa
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="border-t border-border">
                  {paginatedNotes.map((note, index) => (
                    <article
                      key={note.id}
                      className={cn(
                        "group border-b border-border",
                        deleteMode === note.id && "bg-destructive/5"
                      )}
                    >
                      <div className="py-8 lg:py-10">
                        <div className="flex items-start gap-8 lg:gap-16">
                          {/* Index */}
                          <div className="hidden lg:block w-16 shrink-0">
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {String((currentPage - 1) * 6 + index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <pre
                              className={cn(
                                "overflow-x-auto",
                                !expandedNotes[note.id] && "max-h-[120px] overflow-y-hidden"
                              )}
                            >
                              <code
                                className="hljs block p-4 text-[13px] leading-relaxed rounded-none bg-[#0d1117]"
                                dangerouslySetInnerHTML={{
                                  __html: hljs.highlightAuto(note.content).value,
                                }}
                              />
                            </pre>
                            {countLines(note.content) > 4 && (
                              <button
                                onClick={() => toggleNoteExpansion(note.id)}
                                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {expandedNotes[note.id] ? "Thu gọn" : "Xem thêm"}
                              </button>
                            )}
                          </div>

                          {/* Meta & Actions */}
                          <div className="w-32 lg:w-48 shrink-0 flex flex-col items-end gap-4">
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</div>
                              <div className="text-xs text-muted-foreground">{formatTime(note.timestamp)}</div>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleCopy(note.content)}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownload(note.content, note.timestamp)}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setDeleteMode(note.id); setDeleteCode(""); }}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 pt-16">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={cn(
                          "w-10 h-10 text-sm transition-colors",
                          currentPage === page
                            ? "text-foreground border-b-2 border-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-2xl border-border rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal">Ghi chú mới</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TextareaAutosize
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Dán code, văn bản hoặc ghi chú của bạn vào đây..."
              className="w-full min-h-[240px] p-4 bg-muted/50 text-sm font-mono leading-relaxed resize-none outline-none border border-border focus:border-foreground transition-colors"
              minRows={10}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowAddForm(false)}
              className="rounded-none"
            >
              Hủy
            </Button>
            <Button
              onClick={() => { handleAddNote(); setShowAddForm(false); }}
              disabled={!newNote.trim()}
              className="rounded-none"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteMode !== null}
        onOpenChange={(open) => { if (!open) { setDeleteMode(null); setDeleteCode(""); } }}
      >
        <DialogContent className="sm:max-w-md border-border rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal">Xóa ghi chú</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Nhập <span className="font-mono text-foreground">XOA</span> để xác nhận xóa
          </p>
          <Input
            value={deleteCode}
            onChange={(e) => setDeleteCode(e.target.value)}
            placeholder="Nhập tại đây..."
            className="rounded-none border-border focus:border-foreground font-mono text-center"
            autoFocus
          />
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => { setDeleteMode(null); setDeleteCode(""); }}
              className="rounded-none"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteNote(deleteMode!)}
              disabled={deleteCode.toUpperCase() !== "XOA"}
              className="rounded-none"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
            borderRadius: 0,
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default NotePage;
