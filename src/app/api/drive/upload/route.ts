import { NextResponse } from "next/server";
import Redis from "ioredis";
import { drive } from "@/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const CONFIG_KEY = "upload_config";

// Cấu hình mặc định
const DEFAULT_CONFIG = {
  maxUploadsPerMinute: 5,
  maxUploadsPerHour: 30,
  maxFileSize: 50, // MB
  cooldownAfterLimit: 60,
  blockedExtensions: [
    ".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".js", ".jar",
    ".msi", ".dll", ".scr", ".com", ".pif", ".application", ".gadget",
    ".hta", ".cpl", ".msc", ".ws", ".wsf", ".wsc", ".wsh", ".reg",
  ],
};

type UploadConfig = typeof DEFAULT_CONFIG;

async function getConfig(): Promise<UploadConfig> {
  try {
    const configStr = await redis.get(CONFIG_KEY);
    return configStr ? JSON.parse(configStr) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIP || "unknown";
}

async function checkRateLimit(ip: string, config: UploadConfig): Promise<{ allowed: boolean; message?: string }> {
  const minuteKey = `upload_rate:${ip}:minute`;
  const hourKey = `upload_rate:${ip}:hour`;
  const cooldownKey = `upload_cooldown:${ip}`;

  // Kiểm tra cooldown
  const cooldown = await redis.get(cooldownKey);
  if (cooldown) {
    const ttl = await redis.ttl(cooldownKey);
    return { allowed: false, message: `Bạn đã upload quá nhiều. Vui lòng chờ ${ttl} giây.` };
  }

  // Kiểm tra rate limit theo phút
  const minuteCount = await redis.incr(minuteKey);
  if (minuteCount === 1) {
    await redis.expire(minuteKey, 60);
  }
  if (minuteCount > config.maxUploadsPerMinute) {
    await redis.setex(cooldownKey, config.cooldownAfterLimit, "1");
    return { allowed: false, message: `Vượt quá ${config.maxUploadsPerMinute} file/phút. Chờ ${config.cooldownAfterLimit}s.` };
  }

  // Kiểm tra rate limit theo giờ
  const hourCount = await redis.incr(hourKey);
  if (hourCount === 1) {
    await redis.expire(hourKey, 3600);
  }
  if (hourCount > config.maxUploadsPerHour) {
    return { allowed: false, message: `Vượt quá ${config.maxUploadsPerHour} file/giờ.` };
  }

  return { allowed: true };
}

function validateFile(file: File, config: UploadConfig): { valid: boolean; message?: string } {
  const maxSizeBytes = config.maxFileSize * 1024 * 1024;
  
  // Kiểm tra kích thước
  if (file.size > maxSizeBytes) {
    return { valid: false, message: `File quá lớn. Tối đa ${config.maxFileSize}MB.` };
  }

  // Kiểm tra extension bị chặn
  const fileName = file.name.toLowerCase();
  for (const ext of config.blockedExtensions) {
    if (fileName.endsWith(ext.toLowerCase())) {
      return { valid: false, message: `Loại file ${ext} không được phép upload.` };
    }
  }

  // Kiểm tra tên file có ký tự đặc biệt nguy hiểm
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (dangerousChars.test(file.name)) {
    return { valid: false, message: "Tên file chứa ký tự không hợp lệ." };
  }

  return { valid: true };
}

export async function POST(request: Request) {
  try {
    const config = await getConfig();
    const clientIP = getClientIP(request);

    // Kiểm tra rate limit
    const rateLimitResult = await checkRateLimit(clientIP, config);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const parentId = formData.get("parentId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file, config);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const rootFolderId =
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
      "1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf";
    const fileMetadata = {
      name: file.name,
      parents: [parentId || rootFolderId],
    };

    const media = {
      mimeType: file.type,
      body: require("stream").Readable.from(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
      supportsAllDrives: true,
    });

    // Xóa cache của thư mục cha
    const parentKey = parentId
      ? `drive_files:${parentId}_`
      : "drive_files:root_";

    await redis.del(parentKey);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải file lên" },
      { status: 500 }
    );
  }
}
