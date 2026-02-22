import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

// Configure Cloudinary with explicit settings
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Verify configuration
console.log("Cloudinary configured:", {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY
    ? "***" + env.CLOUDINARY_API_KEY.slice(-4)
    : "missing",
});

export { cloudinary };

// Test connection function
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    return {
      success: true,
      message: "Cloudinary connected successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Cloudinary connection failed",
      error: error.message,
    };
  }
};
