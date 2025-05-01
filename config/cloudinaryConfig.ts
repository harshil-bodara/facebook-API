import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// TypeScript interface for environment variables
interface CloudinaryEnvConfig {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

// Ensure the environment variables are properly typed
const cloudinaryEnvConfig: CloudinaryEnvConfig = process.env as unknown as CloudinaryEnvConfig;

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinaryEnvConfig.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryEnvConfig.CLOUDINARY_API_KEY,
  api_secret: cloudinaryEnvConfig.CLOUDINARY_API_SECRET,
});

export default cloudinary;
