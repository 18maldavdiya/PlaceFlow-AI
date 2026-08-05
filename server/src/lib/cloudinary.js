import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Configures the shared Cloudinary SDK instance from environment variables.
 * No upload logic lives here — this is configuration only; a future
 * `services/uploadService.js` will call `cloudinary.uploader.upload(...)`
 * using this configured instance once a media-upload feature is built.
 */
if (env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
} else if (env.isDevelopment) {
  logger.warn(
    "Cloudinary credentials are not set — uploads will fail until CLOUDINARY_* env vars are configured.",
  );
}

export { cloudinary };
export default cloudinary;
