import React from "react";
import loadable from "@loadable/component";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import * as Styled from "./styles";

const Loading = ({ timedOut, retry }) => {
  const handleTimeOut = useErrorHandler();
  if (timedOut) handleTimeOut({ timeout: retry });
  return null;
};

const TOCList = loadable(() => import("./List"));

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
      <TOCList fallback={Loading} {...props} />
    </ErrorBoundary>
  );
}
