import { useCallback } from "react";
import BrowserCookieHelper from "helpers/cookie/Browser";
import { useNavigate, useRevalidator, useLocation } from "react-router";

const cookie = new BrowserCookieHelper();

/**
 * Hook to handle logout.
 * Destroys auth cookie and triggers route revalidation to update auth context.
 */
export default function useLogout() {
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    cookie.remove("authToken");

    if (location.pathname !== "/") return navigate("/");

    revalidate();
  }, [revalidate, navigate, location]);
}
