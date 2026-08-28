import { useEffect, useCallback, useState, useRef } from "react";
import { queryApi } from "api";
import loadAllPages from "lib/react-router/loaders/loadAllPages";

/**
 * @param {function} fetchFn   returns an api request descriptor
 * @param {Array}    deps      re-fetch when these change
 * @param {object}   [options]
 * @param {boolean}  [options.condition=true]  skip the fetch when false
 * @param {boolean}  [options.loadAll=false]   follow pagination and merge every
 *   page into `data` (see loaders/loadAllPages)
 */
export default function useFetch(fetchFn, deps = [], options = {}) {
  const { condition = true, loadAll = false } = options;
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
      const response = loadAll
        ? await loadAllPages({ request, signal })
        : await queryApi(request, null, signal);
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
  }, [...deps, condition, loadAll]);
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
