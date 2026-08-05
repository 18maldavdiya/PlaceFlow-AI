import { io } from "socket.io-client";

import { env } from "@/config/env";

/**
 * Single Socket.io client instance, created but not auto-connected —
 * `autoConnect: false` because we only want a live socket once a session
 * exists (wired when auth lands). Call `socket.connect()` after sign-in and
 * `socket.disconnect()` on sign-out; nothing should call `io()` again
 * elsewhere.
 */
export const socket = io(env.socketUrl, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

if (env.isDev) {
  socket.on("connect_error", (err) => {
    // eslint-disable-next-line no-console
    console.warn("[socket] connection error:", err.message);
  });
}

export default socket;
