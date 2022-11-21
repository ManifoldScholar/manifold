import React from "react";
import Loadable from "@docusaurus/react-loadable";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";

const Loading = ({ timedOut, retry }) => {
  const handleTimeOut = useErrorHandler();
  if (timedOut) handleTimeOut({ timeout: retry });
  return null;
};

const TOCList = Loadable({
  loader: () => import("./List"),
  render(loaded, props) {
    const List = loaded.default;
    return <List {...props} />;
  },
  loading: Loading
});

// TODO: Update this to allow the user to retry/refresh on load + api errors.
const Fallback = ({ error }) => {
  if (error.timeout) {
    return <div>Loading timed out...</div>;
  }
  return <div>error</div>;
};

export default function Loader(props) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <TOCList {...props} />
    </ErrorBoundary>
  );
}
