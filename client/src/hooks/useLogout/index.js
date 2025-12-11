import { useCallback } from "react";
import BrowserCookieHelper from "helpers/cookie/Browser";
import useRevalidate from "../useRevalidate";

const cookie = new BrowserCookieHelper();

/**
 * Hook to handle logout.
 * Destroys auth cookie and triggers route revalidation to update auth context.
 */
export default function useLogout() {
  const revalidate = useRevalidate();

  return useCallback(() => {
    cookie.remove("authToken");
    revalidate();
  }, [revalidate]);
}
