import { useContext } from "react";
import { AppContext } from "app/contexts";

/**
 * Hook to trigger route revalidation.
 * Call this after login/logout to refresh auth state from middleware.
 */
export default function useRevalidate() {
  const { revalidate } = useContext(AppContext);
  return revalidate;
}
