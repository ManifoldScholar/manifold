import { useRef, useEffect } from "react";
import { useNavigation } from "react-router";
import { useFromStore } from "hooks";

export default function LoadingBar() {
  const navigation = useNavigation();
  const apiLoading = useFromStore({ path: "ui.transitory.loading.active" });
  const loading = navigation.state === "loading" || apiLoading;

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
