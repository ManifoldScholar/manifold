import React, { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ClientOnly from "global/components/utility/ClientOnly";
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
  return (
    <ClientOnly>
      <ErrorBoundary FallbackComponent={Fallback}>
        <Suspense fallback={null}>
          <TOCList {...props} />
        </Suspense>
      </ErrorBoundary>
    </ClientOnly>
  );
}
