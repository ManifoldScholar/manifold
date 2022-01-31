import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import { useUID } from "react-uid";

export default function useApiCallback(apiMethod, options = {}) {
  const dispatch = useDispatch();
  const [requestKey] = useState(`fetch_${useUID()}`);

  const triggerCall = useCallback(
    (...args) => {
      const call = apiMethod(...args);
      const action = entityStoreActions.request(call, requestKey, options);
      const { promise } = dispatch(action);
      return promise;
    },
    [apiMethod, dispatch, options, requestKey]
  );

  return triggerCall;
}
