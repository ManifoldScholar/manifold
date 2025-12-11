import { useCallback } from "react";
import { queryApi } from "api";

export default function useApiCallback(apiMethod) {
  return useCallback((...args) => queryApi(apiMethod(...args)), [apiMethod]);
}
