import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const CONFIG_KEY = "upload_config";

// Cấu hình mặc định
export const DEFAULT_CONFIG = {
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

// Helper function để lấy config
export async function getUploadConfig(): Promise<UploadConfig> {
  try {
    const configStr = await redis.get(CONFIG_KEY);
    return configStr ? JSON.parse(configStr) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

// Helper function để lưu config
export async function saveUploadConfig(config: UploadConfig): Promise<void> {
  await redis.set(CONFIG_KEY, JSON.stringify(config));
}

export { redis, CONFIG_KEY };
