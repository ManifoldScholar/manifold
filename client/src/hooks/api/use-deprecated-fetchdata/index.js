/*
This hook supports the old way of fetching data, with static fetchData methods on class
components. When these components have been converted to functional components, it can
be removed.
 */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { useUID } from "react-uid";
import InternalContext from "../contexts/InternalContext";
import { isPromise } from "utils/promise";
import config from "config";
import ch from "helpers/consoleHelpers";

function log(type, key) {
  if (config.environment.isDevelopment) {
    ch.notice(`${type}: ${key}`, "floppy_disk");
  }
}

export default function useDeprecatedFetchData(fetchData, location, match) {
  const firstRun = useRef(true);
  const dispatch = useDispatch();
  const store = useStore();
  const [requestKey] = useState(`fetch_${useUID()}`);
  const getState = store.getState;

  const internalContext = useContext(InternalContext);

  /* eslint-disable react-hooks/exhaustive-deps */
  const triggerFetchData = useCallback(() => {
    log("useDeprecatedFetchData", requestKey);
    return fetchData(getState, dispatch, location, match);
  }, [getState, fetchData, requestKey, dispatch, location, match]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Fetch on the server
  if (
    firstRun.current &&
    !internalContext.resolved &&
    config.environment.isServer
  ) {
    const result = triggerFetchData();
    const effects = [];
    if (isPromise(result)) effects.push(result);
    if (Array.isArray(result)) {
      result.forEach(aResult => {
        if (isPromise(aResult)) effects.push(aResult);
      });
    }
    internalContext.requests.push({
      id: requestKey,
      promise: Promise.all(effects),
      cancel: () => {}
    });
  }

  // Fetch in the browser. Maintain previous fetchData behavior which was to only refetch
  // when the URL changes.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    triggerFetchData();
  }, [match.url]);
  /* eslint-enable react-hooks/exhaustive-deps */

  firstRun.current = false;
  return triggerFetchData;
}
