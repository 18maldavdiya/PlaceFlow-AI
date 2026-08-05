/**
 * Centralized, validated access to environment variables.
 *
 * Nothing else in the app should read `import.meta.env` directly — importing
 * from here means every consumer gets a single, typed shape and a loud
 * failure in development if a required variable is missing, instead of a
 * silent `undefined` surfacing three layers deep in a service call.
 */

const required = (key, value) => {
  if (value === undefined || value === "") {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        `[env] Missing required environment variable "${key}". Falling back to an empty string — set it in client/.env.`,
      );
    }
    return "";
  }
  return value;
};

export const env = Object.freeze({
  apiBaseUrl: required(
    "VITE_API_BASE_URL",
    import.meta.env.VITE_API_BASE_URL,
  ),
  socketUrl: required("VITE_SOCKET_URL", import.meta.env.VITE_SOCKET_URL),
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryUploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "",
  appName: import.meta.env.VITE_APP_NAME ?? "PlaceFlow AI",
  appEnv: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
});

export default env;
