import { useContext } from "react";
import { ReaderContext } from "helpers/contexts";

export default function useReaderContext() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error(`Could not detect a Reader context.`);
  }
  return context;
}
