import { useRef, useEffect } from "react";
import { useNavigation, useRevalidator, useFetchers } from "react-router";
import { useTranslation } from "react-i18next";

export default function LoadingBar() {
  const { t } = useTranslation();
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
        {/* Informational image for screen readers. Less noisy than */}
        {/* role=status; users can find this information if needed. */}
        {loading && (
          <div
            className="screen-reader-text"
            role="img"
            aria-label={t("common.loading_page")}
          />
        )}
        <div className="progress" />
      </div>
    </div>
  );
}
