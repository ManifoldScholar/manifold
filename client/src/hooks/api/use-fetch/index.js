import React, {
  useEffect,
  useContext,
  useCallback,
  useRef,
  useState
} from "react";
import { useSelector, useStore, useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import entityUtils from "utils/entityUtils";
import { useUID } from "react-uid";
import { isPromise } from "utils/promise";
import config from "config";
import ch from "helpers/consoleHelpers";

export const InternalContext = React.createContext({
  requests: [],
  resolved: false
});

export const createServerFetchDataContext = () => {
  const internalContextValue = {
    requests: [],
    resolved: false
  };
  function ServerFetchDataContext(props) {
    return (
      <InternalContext.Provider value={internalContextValue}>
        {props.children}
      </InternalContext.Provider>
    );
  }
  const isFetchingComplete = async () => {
    const effects = internalContextValue.requests.map(item => item.promise);
    await Promise.all(effects);
    internalContextValue.resolved = true;
  };
  return {
    ServerFetchDataContext,
    isFetchingComplete
  };
};

function log(type, key) {
  if (config.environment.isDevelopment) {
    ch.notice(`${type}: ${key}`, "floppy_disk");
  }
}

/*
This hook supports the old way of fetching data, with static fetchData methods on class
components. When these components have been converted to functional components, it can
be removed.
 */
export function useDeprecatedFetchData(fetchData, location, match) {
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

export default function useFetch({ request }) {
  const firstRun = useRef(true);
  const uid = `fetch_${useUID()}`;
  const [requestKey] = useState(`fetch_${useUID()}`);
  const dispatch = useDispatch();

  const internalContext = useContext(InternalContext);

  const [apiCall, ...apiCallArgs] = request;

  /* eslint-disable react-hooks/exhaustive-deps */
  const triggerFetchData = useCallback(() => {
    log("useFetch", requestKey);
    const apiFetch = apiCall(...apiCallArgs);
    const action = entityStoreActions.request(apiFetch, requestKey);
    const { promise } = dispatch(action);
    return promise;
  }, [apiCall, ...apiCallArgs, dispatch, requestKey]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Fetch on the server
  if (
    firstRun.current &&
    !internalContext.resolved &&
    config.environment.isServer
  ) {
    let cancel = Function.prototype;

    if (!internalContext.resolved) {
      const effectPr = new Promise(resolve => {
        cancel = () => {
          resolve(requestKey);
        };

        return triggerFetchData()
          .then(res => {
            return res;
          })
          .then(() => {
            resolve(requestKey);
          })
          .catch(() => {
            resolve(requestKey);
          });
      });

      internalContext.requests.push({
        id: requestKey,
        promise: effectPr,
        cancel
      });
    }
  }

  useEffect(() => {
    triggerFetchData();
  }, [triggerFetchData]);

  const data = useSelector(state =>
    entityUtils.select(requestKey, state.entityStore)
  );

  const meta = useSelector(state =>
    entityUtils.meta(requestKey, state.entityStore)
  );

  const loaded = useSelector(state =>
    entityUtils.loaded(requestKey, state.entityStore)
  );

  firstRun.current = false;

  return { data, meta, loaded, uid };
}
