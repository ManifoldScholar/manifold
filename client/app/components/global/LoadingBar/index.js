import { useRef, useEffect } from "react";
import { useNavigation, useRevalidator, useFetchers } from "react-router";

export default function LoadingBar() {
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const fetchers = useFetchers();

  // Check if any fetcher is active
  const hasActiveFetcher = fetchers.some(
    fetcher => fetcher.state === "submitting" || fetcher.state === "loading"
  );

  // Show loading bar during:
  // - Navigation
  // - Revalidation
  // - Active fetchers
  const loading =
    navigation.state === "loading" ||
    navigation.state === "submitting" || // Form submissions via useSubmit
    revalidator.state === "loading" ||
    hasActiveFetcher;

  const loaderRef = useRef(null);
  const timerRef = useRef(null);
  const prevLoadingRef = useRef(loading);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const wasLoading = prevLoadingRef.current;

    if (wasLoading && !loading) {
      // Finished loading
      loader.className = "loading-bar complete";
      timerRef.current = setTimeout(() => {
        loader.className = "loading-bar default";
      }, 800);
    } else if (!wasLoading && loading) {
      // Started loading
      loader.className = "loading-bar loading";
    }

    prevLoadingRef.current = loading;

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [loading]);

  return (
    <div>
      <div ref={loaderRef} className="loading-bar default">
        <div className="progress" />
      </div>
    </div>
  );
}
