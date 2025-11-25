"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { Shield, Save, RefreshCw, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UploadConfig {
  maxUploadsPerMinute: number;
  maxUploadsPerHour: number;
  maxFileSize: number;
  cooldownAfterLimit: number;
  blockedExtensions: string[];
}

export default function AdminPage() {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<UploadConfig>({
    maxUploadsPerMinute: 5,
    maxUploadsPerHour: 30,
    maxFileSize: 50,
    cooldownAfterLimit: 60,
    blockedExtensions: [],
  });

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      setConfig(data);
    } catch {
      toast.error("Không thể tải cấu hình");
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      setIsAuthenticated(true);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, config }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Lỗi khi lưu");
        if (res.status === 401) setIsAuthenticated(false);
        return;
      }

      toast.success("Đã lưu cấu hình thành công!");
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Toaster position="top-center" />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-2 text-primary" />
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Mật khẩu Admin</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                />
              </div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full mt-2">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#374151" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Quản lý cấu hình Upload</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Trang chủ
              </Button>
            </Link>
            <Button variant="outline" onClick={fetchConfig}>
              <RefreshCw className="w-4 h-4 mr-2" /> Làm mới
            </Button>
          </div>
        </div>

        {/* Rate Limit Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚡ Rate Limit</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Số file tối đa / phút</Label>
              <Input
                type="number"
                min={1}
                value={config.maxUploadsPerMinute}
                onChange={(e) =>
                  setConfig({ ...config, maxUploadsPerMinute: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Số file tối đa / giờ</Label>
              <Input
                type="number"
                min={1}
                value={config.maxUploadsPerHour}
                onChange={(e) =>
                  setConfig({ ...config, maxUploadsPerHour: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Kích thước file tối đa (MB)</Label>
              <Input
                type="number"
                min={1}
                value={config.maxFileSize}
                onChange={(e) =>
                  setConfig({ ...config, maxFileSize: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Thời gian chờ sau khi vượt limit (giây)</Label>
              <Input
                type="number"
                min={1}
                value={config.cooldownAfterLimit}
                onChange={(e) =>
                  setConfig({ ...config, cooldownAfterLimit: Number(e.target.value) })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Blocked Extensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚫 Extensions bị chặn</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Mỗi extension một dòng (vd: .exe)</Label>
            <Textarea
              rows={5}
              value={config.blockedExtensions.join("\n")}
              onChange={(e) =>
                setConfig({
                  ...config,
                  blockedExtensions: e.target.value.split("\n").filter((x) => x.trim()),
                })
              }
              placeholder=".exe&#10;.bat&#10;.cmd"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </div>
    </div>
  );
}
