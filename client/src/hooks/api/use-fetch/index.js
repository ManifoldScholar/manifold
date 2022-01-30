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

function log(type, key) {
  if (config.environment.isDevelopment) {
    ch.notice(`${type}: ${key}`, "floppy_disk");
  }
}

export default function useFetch({ request, options = {} }) {
  const firstRun = useRef(true);
  const uid = `fetch_${useUID()}`;
  const [requestKey] = useState(`fetch_${useUID()}`);
  const [count, setCount] = useState(1);
  const store = useStore();
  const getState = store.getState;
  const dispatch = useDispatch();

  const internalContext = useContext(InternalContext);

  const [apiCall, ...apiCallArgs] = request;

  if (count > 25)
    throw new Error(
      "useFetch tried to fetch data more than 25 times. This suggests that an input to useFetch needs to be memoized."
    );

  /* eslint-disable react-hooks/exhaustive-deps */
  const triggerFetchData = useCallback(() => {
    log("useFetch", requestKey);
    setCount(count + 1);
    const apiFetch = apiCall(...apiCallArgs);
    const action = entityStoreActions.request(apiFetch, requestKey, options);
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

  const response = getState()?.entityStore?.responses?.requestKey;

  firstRun.current = false;
  return { data, meta, loaded, uid, response, refresh: triggerFetchData };
}
