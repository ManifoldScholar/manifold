import { useCallback } from "react";
import cookie from "js-cookie";
import { ApiClient } from "api";

export default function useApiCallback(apiMethod, ignoredOptions = {}) {
  const triggerCall = useCallback(
    (...args) => {
      const authToken = cookie.get("authToken");
      const client = new ApiClient(authToken, { denormalize: true });
      const call = apiMethod(...args);
      return client.call(call);
    },
    [apiMethod]
  );

  return triggerCall;
}
