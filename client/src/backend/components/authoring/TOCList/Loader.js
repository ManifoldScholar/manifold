import React, { lazy, Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as Styled from "./styles";

const TOCList = lazy(() => import("./List"));

const Fallback = ({ error }) => {
  return (
    <Styled.Error>
      There was a problem loading your TOC: {error.message}. Refresh the page to
      try again.
    </Styled.Error>
  );
};

export default function Loader(props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Suspense fallback={null}>
        <TOCList {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
