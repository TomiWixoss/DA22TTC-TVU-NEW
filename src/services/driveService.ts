import { DriveInfo, FileItem } from "../types";

const sortFilesByType = (files: FileItem[]) => {
  return [...files].sort((a, b) => {
    const isAFolder = a.mimeType === "application/vnd.google-apps.folder";
    const isBFolder = b.mimeType === "application/vnd.google-apps.folder";
    if (isAFolder && !isBFolder) return -1;
    if (!isAFolder && isBFolder) return 1;
    return 0;
  });
};

export const driveService = {
  // Lấy thông tin Drive
  async getDriveInfo(): Promise<DriveInfo> {
    const response = await fetch("/api/drive/info");
    if (!response.ok) throw new Error("Failed to fetch drive info");
    return response.json();
  },

  // Lấy danh sách files
  async getFiles(folderId?: string | null): Promise<FileItem[]> {
    const url = folderId ? `/api/drive?folderId=${folderId}` : "/api/drive";
    const response = await fetch(url, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!response.ok) throw new Error("Failed to fetch files");
    const data = await response.json();
    return sortFilesByType(data.files || []);
  },

  // Lấy tất cả files (cho AI search)
  async getAllFiles(): Promise<FileItem[]> {
    const response = await fetch("/api/drive/all");
    if (!response.ok) throw new Error("Failed to fetch all files");
    const data = await response.json();
    return data.files || [];
  },

  // Tìm kiếm files
  async searchFiles(query: string): Promise<FileItem[]> {
    const response = await fetch(`/api/drive?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to search files");
    const data = await response.json();
    return sortFilesByType(data.files || []);
  },

  // Tạo thư mục
  async createFolder(name: string, parentId?: string | null): Promise<{ id: string; error?: string }> {
    const response = await fetch("/api/drive/create-folder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ name, parentId }),
    });
    return response.json();
  },

  // Upload file với progress callback
  async uploadFile(
    file: File,
    parentId?: string | null,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      if (parentId) formData.append("parentId", parentId);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/drive/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) resolve();
        else reject(new Error(`Upload failed with status ${xhr.status}`));
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  },

  // Xóa file
  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`/api/drive/delete?fileId=${fileId}`, {
      method: "DELETE",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!response.ok) throw new Error("Failed to delete file");
  },

  // Download file
  async getDownloadUrl(fileId: string): Promise<string> {
    const response = await fetch(`/api/drive/download?fileId=${fileId}`);
    if (!response.ok) throw new Error("Failed to get download url");
    const data = await response.json();
    return data.downloadUrl;
  },

  // Reload cache
  async reloadCache(): Promise<void> {
    const response = await fetch("/api/drive/reload-cache", { method: "POST" });
    if (!response.ok) throw new Error("Failed to reload cache");
  },

  // Lấy API key cho AI search
  async getAISearchKey(): Promise<string> {
    const response = await fetch("/api/drive/ai-search");
    if (!response.ok) throw new Error("Failed to get AI search key");
    const data = await response.json();
    return data.apiKey;
  },

  // Lấy danh sách files trong folder để download
  async getFolderFiles(folderId: string): Promise<FileItem[]> {
    const response = await fetch(`/api/drive/download-folder?folderId=${folderId}`);
    if (!response.ok) throw new Error("Failed to get folder files");
    const data = await response.json();
    return data.files || [];
  },

  // Download file content as blob
  async downloadFileBlob(fileId: string): Promise<Blob> {
    const response = await fetch(`/api/drive/download-folder?fileId=${fileId}`);
    if (!response.ok) throw new Error("Failed to download file");
    return response.blob();
  },

  // Verify password for delete
  async verifyPassword(password: string): Promise<boolean> {
    const response = await fetch("/api/drive/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return response.ok;
  },
};
