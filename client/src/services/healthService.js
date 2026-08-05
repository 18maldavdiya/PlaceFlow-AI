import { api } from "@/services/api";

/**
 * Thin wrapper around the server's health-check endpoint. Exists mainly to
 * prove, end to end, that the Axios instance, the Vite dev proxy, and the
 * server's /health route are all wired correctly — every future service
 * module should follow this same shape (one function per endpoint,
 * returning `response.data`).
 */
export async function getServerHealth() {
  const response = await api.get("/health");
  return response.data;
}

export default { getServerHealth };
