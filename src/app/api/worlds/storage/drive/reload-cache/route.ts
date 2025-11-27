import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function POST() {
    try {
        // Xóa tất cả cache Redis liên quan đến drive
        const keys = await redis.keys('drive:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }

        // Xóa thêm các key cache khác nếu có
        const allKeys = await redis.keys('*');
        if (allKeys.length > 0) {
            await redis.del(...allKeys);
        }

        return NextResponse.json({
            success: true,
            message: 'Đã xóa cache thành công',
            clearedKeys: allKeys.length
        });

    } catch (error: any) {
        console.error('Lỗi khi xóa cache:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi xóa cache',
                details: error.message
            },
            { status: 500 }
        );
    }
}
