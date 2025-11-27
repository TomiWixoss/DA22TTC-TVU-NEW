import { NextResponse } from "next/server";
import { getUploadConfig, saveUploadConfig, DEFAULT_CONFIG } from "@/shared/lib/uploadConfig";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export type { UploadConfig } from "@/shared/lib/uploadConfig";

// GET - Lấy cấu hình hiện tại
export async function GET() {
  try {
    const config = await getUploadConfig();
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

    await saveUploadConfig(config);

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json(
      { error: "Lỗi khi lưu cấu hình" },
      { status: 500 }
    );
  }
}
