import { useMemo } from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  useLoaderData
} from "react-router";
import classNames from "classnames";
import { FrontendContext } from "app/contexts";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { useFromStore } from "hooks";
import { SearchProvider } from "hooks/useSearch/context";
import FatalError from "global/components/FatalError";

// Handles 404 errors for frontend routes
export function ErrorBoundary() {
  const error = useRouteError();
  const loaderData = useLoaderData();
  const frontendMode = useFromStore({ path: "ui.transitory.frontendMode" });

  // Only handle 404 errors here, re-throw others to root ErrorBoundary
  if (isRouteErrorResponse(error) && error.status === 404) {
    const frontendContextValue = useMemo(
      () => ({
        subjects: loaderData?.subjects ?? [],
        journalSubjects: loaderData?.journalSubjects ?? [],
        frontendMode: frontendMode ?? {}
      }),
      [loaderData?.subjects, loaderData?.journalSubjects, frontendMode]
    );

    const formattedError = {
      type: "HTTP_RESPONSE",
      error: {
        status: 404,
        heading: "Page not found",
        body: null
      }
    };

    return (
      <FrontendContext.Provider value={frontendContextValue}>
        <BreadcrumbsProvider>
          <Utility.ScrollToTop />
          <SearchProvider>
            <Layout.Header />
            <main
              id="skip-to-main"
              tabIndex={-1}
              className={classNames({
                "main-content": true,
                "flex-viewport": true
              })}
            >
              <FatalError fatalError={formattedError} contained />
            </main>
            <Footers.FrontendFooter />
          </SearchProvider>
        </BreadcrumbsProvider>
      </FrontendContext.Provider>
    );
  }

  // Re-throw non-404 errors to root ErrorBoundary
  throw error;
}
