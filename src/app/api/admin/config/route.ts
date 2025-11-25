import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const CONFIG_KEY = "upload_config";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Cấu hình mặc định
const DEFAULT_CONFIG = {
  maxUploadsPerMinute: 5,
  maxUploadsPerHour: 30,
  maxFileSize: 50, // MB
  cooldownAfterLimit: 60, // giây
  blockedExtensions: [
    ".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".js", ".jar",
    ".msi", ".dll", ".scr", ".com", ".pif", ".application", ".gadget",
    ".hta", ".cpl", ".msc", ".ws", ".wsf", ".wsc", ".wsh", ".reg",
  ],
};

export type UploadConfig = typeof DEFAULT_CONFIG;

// GET - Lấy cấu hình hiện tại
export async function GET() {
  try {
    const configStr = await redis.get(CONFIG_KEY);
    const config = configStr ? JSON.parse(configStr) : DEFAULT_CONFIG;
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting config:", error);
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

// POST - Cập nhật cấu hình
export async function POST(request: Request) {
  try {
    const { password, config } = await request.json();

    // Xác thực admin
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Validate config
    if (
      typeof config.maxUploadsPerMinute !== "number" ||
      typeof config.maxUploadsPerHour !== "number" ||
      typeof config.maxFileSize !== "number" ||
      typeof config.cooldownAfterLimit !== "number"
    ) {
      return NextResponse.json(
        { error: "Cấu hình không hợp lệ" },
        { status: 400 }
      );
    }

    await redis.set(CONFIG_KEY, JSON.stringify(config));

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json(
      { error: "Lỗi khi lưu cấu hình" },
      { status: 500 }
    );
  }
}

// Helper function để lấy config (export cho upload route sử dụng)
export async function getUploadConfig(): Promise<UploadConfig> {
  try {
    const configStr = await redis.get(CONFIG_KEY);
    return configStr ? JSON.parse(configStr) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}
