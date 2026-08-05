import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setOnlineStatus } from "@/store/slices/appSlice";

/**
 * Keeps `state.app.isOnline` in sync with the browser's connectivity
 * events. Mounted once, at the App root — not per-page.
 */
export function useOnlineStatus() {
  const dispatch = useDispatch();

  useEffect(() => {
    const goOnline = () => dispatch(setOnlineStatus(true));
    const goOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [dispatch]);
}

export default useOnlineStatus;
