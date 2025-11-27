import { NextResponse } from "next/server";
import Redis from "ioredis";
import { drive } from "@/shared/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function GET() {
  try {
    // Tạo cache key cho thông tin drive
    const cacheKey = "drive_info";

    // Kiểm tra cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          "X-Cache": "HIT",
        },
      });
    }

    // Sử dụng API about.get để lấy thông tin dung lượng chính xác
    const aboutResponse = await drive.about.get({
      fields: "storageQuota",
    });

    const storageQuota = aboutResponse.data.storageQuota;

    const total = Number(storageQuota?.limit || 0);
    const used = Number(storageQuota?.usage || 0);
    const remaining = total - used;

    const result = {
      total,
      used,
      remaining,
    };

    // Lưu vào cache trong 5 phút
    await redis.setex(cacheKey, 300, JSON.stringify(result));

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Drive info error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin drive" },
      { status: 500 }
    );
  }
}
