import React from "react";
import PropTypes from "prop-types";
import Loadable from "@docusaurus/react-loadable";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";

const Loading = ({ timedOut, retry }) => {
  const handleTimeOut = useErrorHandler();
  if (timedOut) handleTimeOut({ timeout: retry });
  return null;
};

const MathContext = Loadable({
  loader: () => import("./MathJaxContext"),
  render(loaded, props) {
    const MathJaxContext = loaded.default;
    return <MathJaxContext>{props.children}</MathJaxContext>;
  },
  loading: Loading
});

// TODO: Update this to allow the user to retry/refresh on load errors.
const Fallback = ({ error }) => {
  if (error.timeout) {
    return <div>Loading MathML timed out. Please refresh to try again.</div>;
  }
  return <div>error</div>;
};

export default function MathLoader(props) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <MathContext {...props} />
    </ErrorBoundary>
  );
}
