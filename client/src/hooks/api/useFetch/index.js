import { useEffect, useCallback, useState, useRef } from "react";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useUID } from "react-uid";
import config from "config";
import ch from "helpers/consoleHelpers";
import isFunction from "lodash/isFunction";

function log(type, key) {
  if (config.environment.isDevelopment) {
    ch.notice(`${type}: ${key}`, "floppy_disk");
  }
}

export default function useFetch({
  request,
  afterFetch,
  options = {},
  dependencies = [],
  condition = true
}) {
  const uid = `fetch_${useUID()}`;
  const [requestKey] = useState(options.requestKey ?? `fetch_${useUID()}`);
  const countRef = useRef(0);
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  if (!Array.isArray(request)) {
    throw new Error(
      `useFetch expects the 'request' property to be an array. In most cases, the first
       element in the array is the Manifold API function and subsequent elements are the
       arguments that will be passed to that method.`
    );
  }

  const [apiCall, ...apiCallArgs] = request;

  /* eslint-disable react-hooks/exhaustive-deps */
  const triggerFetchData = useCallback(async () => {
    if (!condition) {
      setResult(null);
      setLoaded(false);
      return Promise.resolve();
    }

    countRef.current += 1;
    if (countRef.current > 25) {
      throw new Error(
        `useFetch tried to fetch data more than 25 times. This suggests that an input to
        useFetch needs to be memoized.`
      );
    }

    log("useFetch", requestKey);
    setLoaded(false);
    setError(null);

    try {
      const apiFetch = apiCall(...apiCallArgs);
      const response = await queryApi(apiFetch);
      setResult(response);
      setLoaded(true);
      if (isFunction(afterFetch)) afterFetch();
      return response;
    } catch (err) {
      setError(err);
      setResult(null);
      setLoaded(true);
      throw err;
    }
  }, [apiCall, ...apiCallArgs, requestKey, condition, afterFetch]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    triggerFetchData().catch(() => {
      // Error already handled in triggerFetchData
    });
  }, [triggerFetchData, ...dependencies]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    data: result?.data ?? null,
    meta: result?.meta ?? null,
    loaded,
    uid,
    response: result,
    refresh: triggerFetchData,
    error
  };
}
