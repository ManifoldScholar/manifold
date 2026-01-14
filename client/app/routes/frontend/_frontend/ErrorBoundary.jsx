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
import formatRouteError from "app/routes/utility/helpers/formatRouteError";

// Handles 404, 401, and 403 errors for frontend routes
export function ErrorBoundary() {
  const error = useRouteError();
  const loaderData = useLoaderData();
  const location = useLocation();
  const frontendMode = useFromStore({ path: "ui.transitory.frontendMode" });

  console.log("error boundary");
  console.log({ error });
  console.log(isRouteErrorResponse(error));

  // Handle route error responses (404, 401, 403)
  if (!!error.status && error.status === 500) {
    console.log("making it here");
    const frontendContextValue = useMemo(
      () => ({
        subjects: loaderData?.subjects ?? [],
        journalSubjects: loaderData?.journalSubjects ?? [],
        frontendMode: frontendMode ?? {}
      }),
      [loaderData?.subjects, loaderData?.journalSubjects, frontendMode]
    );

    const {
      fatalError,
      contained,
      hideStatus,
      userMessage,
      headerLineOne,
      headerLineTwo
    } = formatRouteError(error, location.pathname);

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
              <FatalError
                fatalError={fatalError}
                contained={contained}
                hideStatus={hideStatus}
                userMessage={userMessage}
                headerLineOne={headerLineOne}
                headerLineTwo={headerLineTwo}
              />
            </main>
            <Footers.FrontendFooter />
          </SearchProvider>
        </BreadcrumbsProvider>
      </FrontendContext.Provider>
    );
  }

  // Re-throw non-route errors to root ErrorBoundary
  throw error;
}
