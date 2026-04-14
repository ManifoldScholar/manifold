import { useMemo } from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useLocation
} from "react-router";
import classNames from "classnames";
import { FrontendContext } from "app/contexts";
import Footers from "components/global/Footers";
import { BreadcrumbsProvider } from "components/global/atomic/Breadcrumbs";
import Layout from "components/frontend/layout";
import { SearchProvider } from "hooks/useSearch/context";
import { useScrollToTop } from "hooks";
import FatalError from "components/global/FatalError";
import formatError from "app/routes/utility/helpers/formatError";

const STATUSES = [404, 401, 403, 500];

// Handles 404, 401, 403, and 500 errors for frontend routes
export function ErrorBoundary() {
  const error = useRouteError();
  const loaderData = useLoaderData();
  const location = useLocation();
  useScrollToTop();

  const frontendContextValue = useMemo(
    () => ({
      subjects: loaderData?.subjects ?? [],
      journalSubjects: loaderData?.journalSubjects ?? []
    }),
    [loaderData?.subjects, loaderData?.journalSubjects]
  );

  if (
    isRouteErrorResponse(error) ||
    (!!error.status && STATUSES.includes(error.status))
  ) {
    const errorProps = formatError(error, location.pathname);

    return (
      <FrontendContext.Provider value={frontendContextValue}>
        <BreadcrumbsProvider>
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
