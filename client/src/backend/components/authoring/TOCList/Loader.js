import React from "react";
import Loadable from "@docusaurus/react-loadable";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import * as Styled from "./styles";

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

const Fallback = ({ error }) => {
  return (
    <Styled.Error>
      There was a problem loading your TOC: {error.message}. Refresh the page to
      try again.
    </Styled.Error>
  );
};

export default function Loader(props) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <TOCList {...props} />
    </ErrorBoundary>
  );
}
