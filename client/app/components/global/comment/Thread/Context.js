import { createContext, useContext } from "react";

const ThreadContext = createContext(null);

export function useThread() {
  return useContext(ThreadContext);
}

export default ThreadContext;
