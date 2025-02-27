// cloudinaryConfig.ts
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET } from "@env";

// Định nghĩa kiểu cho cấu hình Cloudinary
interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

// Hàm kiểm tra và ném lỗi nếu biến môi trường không được định nghĩa
function throwEnvError(key: string): never {
  throw new Error(`Environment variable ${key} is not defined. Please check your .env file.`);
}

// Cấu hình Cloudinary từ biến môi trường, với kiểm tra bảo mật
export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: CLOUDINARY_CLOUD_NAME || throwEnvError("CLOUDINARY_CLOUD_NAME"),
  apiKey: CLOUDINARY_API_KEY || throwEnvError("CLOUDINARY_API_KEY"),
  uploadPreset: CLOUDINARY_UPLOAD_PRESET || throwEnvError("CLOUDINARY_UPLOAD_PRESET"),
};