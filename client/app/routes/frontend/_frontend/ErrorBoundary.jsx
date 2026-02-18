import { useMemo } from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useLocation
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
import formatError from "app/routes/utility/helpers/formatError";

const STATUSES = [404, 401, 403, 500];

// Handles 404, 401, 403, and 500 errors for frontend routes
export function ErrorBoundary() {
  const error = useRouteError();
  const loaderData = useLoaderData();
  const location = useLocation();
  const frontendMode = useFromStore({ path: "ui.transitory.frontendMode" });

  const frontendContextValue = useMemo(
    () => ({
      subjects: loaderData?.subjects ?? [],
      journalSubjects: loaderData?.journalSubjects ?? [],
      frontendMode: frontendMode ?? {}
    }),
    [loaderData?.subjects, loaderData?.journalSubjects, frontendMode]
  );

  if (
    isRouteErrorResponse(error) ||
    (!!error.status && STATUSES.includes(error.status))
  ) {
    const errorProps = formatError(error, location.pathname);

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
              <FatalError {...errorProps} contained />
            </main>
            <Footers.FrontendFooter />
          </SearchProvider>
        </BreadcrumbsProvider>
      </FrontendContext.Provider>
    );
  }

  // Re-throw runtime errors to root ErrorBoundary
  throw error;
}
