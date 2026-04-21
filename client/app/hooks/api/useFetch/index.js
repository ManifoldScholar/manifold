import { useEffect, useCallback, useState, useRef } from "react";
import { queryApi } from "api";

export default function useFetch(fetchFn, deps = [], options = {}) {
  const { condition = true } = options;
  const controllerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  /* eslint-disable react-hooks/exhaustive-deps */
  const triggerFetchData = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    if (!condition) {
      setResult(null);
      setLoaded(false);
      setError(null);
      return;
    }

    setLoaded(false);
    setError(null);

    try {
      const request = fetchFnRef.current();
      const response = await queryApi(request, null, signal);
      if (signal.aborted) return;
      setResult(response);
      setLoaded(true);
      return response;
    } catch (err) {
      if (signal.aborted) return;
      setError(err);
      setResult(null);
      setLoaded(true);
      throw err;
    }
  }, [...deps, condition]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    triggerFetchData().catch(() => {
      // Error already handled in triggerFetchData
    });
    return () => controllerRef.current?.abort();
  }, [triggerFetchData]);

  return {
    data: result?.data ?? null,
    meta: result?.meta ?? null,
    loaded,
    refresh: triggerFetchData,
    error
  };
}
