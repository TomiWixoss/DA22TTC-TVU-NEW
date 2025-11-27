import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { drive } from "@/shared/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface GoogleApiError {
    code?: number;
    status?: number;
    message?: string;
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Xóa file vĩnh viễn
        await drive.files.delete({
            fileId: fileId,
        });

        // Xóa cache liên quan
        const keys = await redis.keys('drive_files:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

        return NextResponse.json(
            { message: 'File deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting file:', error);
        
        const apiError = error as GoogleApiError;
        const errorCode = apiError?.code || apiError?.status;
        
        // File không tồn tại - có thể đã bị xóa trước đó
        if (errorCode === 404) {
            // Vẫn xóa cache để đồng bộ
            const keys = await redis.keys('drive_files:*');
            if (keys.length > 0) {
                await redis.del(keys);
            }
            return NextResponse.json(
                { message: 'File already deleted or not found' },
                { status: 200 }
            );
        }
        
        // Không có quyền xóa
        if (errorCode === 403) {
            return NextResponse.json(
                { error: 'Không có quyền xóa file này' },
                { status: 403 }
            );
        }
        
        return NextResponse.json(
            { error: 'Lỗi khi xóa file' },
            { status: 500 }
        );
    }
} 