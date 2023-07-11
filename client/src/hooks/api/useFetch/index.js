import React, {
  useEffect,
  useContext,
  useCallback,
  useRef,
  useState
} from "react";
import InternalContext from "../contexts/InternalContext";
import { useSelector, useDispatch, useStore } from "react-redux";
import { entityStoreActions } from "actions";
import entityUtils from "utils/entityUtils";
import { useUID } from "react-uid";
import config from "config";
import ch from "helpers/consoleHelpers";
import { isFunction } from "lodash";

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
  withAuthDependency = false,
  condition = true
}) {
  const firstRun = useRef(true);
  const uid = `fetch_${useUID()}`;
  const [requestKey] = useState(options.requestKey ?? `fetch_${useUID()}`);
  const [count, setCount] = useState(1);
  const store = useStore();
  const getState = store.getState;
  const dispatch = useDispatch();

  const internalContext = useContext(InternalContext);

  if (!Array.isArray(request)) {
    throw new Error(
      `useFetch expects the 'request' property to be an array. In most cases, the first
       element in the array is the Manifold API function and subsequent elements are the
       arguments that will be passed to that method.`
    );
  }

  const [apiCall, ...apiCallArgs] = request;

  if (count > 25)
    throw new Error(
      `useFetch tried to fetch data more than 25 times. This suggests that an input to
      useFetch needs to be memoized.`
    );

  /* eslint-disable react-hooks/exhaustive-deps */
  const triggerFetchData = useCallback(() => {
    if (!condition) return Promise.resolve();
    log("useFetch", requestKey);
    setCount(count + 1);
    const apiFetch = apiCall(...apiCallArgs);
    const action = entityStoreActions.request(apiFetch, requestKey, options);
    const { promise } = dispatch(action);
    return promise;
  }, [apiCall, ...apiCallArgs, dispatch, requestKey, condition]);
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

  const authentication = useSelector(state => state.authentication);

  const refetchDependencies = withAuthDependency
    ? [
        ...dependencies,
        authentication.authenticated,
        authentication.currentUser?.id
      ]
    : dependencies;

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    triggerFetchData().then(
      () => {
        if (isFunction(afterFetch)) afterFetch();
      },
      () => {
        // do nothing
      }
    );
  }, [triggerFetchData, ...refetchDependencies]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const data = useSelector(state =>
    entityUtils.select(requestKey, state.entityStore)
  );

  const meta = useSelector(state =>
    entityUtils.meta(requestKey, state.entityStore)
  );

  const loaded = useSelector(state =>
    entityUtils.loaded(requestKey, state.entityStore)
  );

  const response = getState()?.entityStore.responses[requestKey];

  firstRun.current = false;
  return { data, meta, loaded, uid, response, refresh: triggerFetchData };
}
