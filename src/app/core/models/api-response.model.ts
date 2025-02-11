export interface ApiResponse<T> {
    data: T | null;
    statusCode: number;
    error?: {
        errors: string[];
        isShow: boolean;
    };
} 