import {
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useLocation
} from "react-router";
import Layout from "reader/components/layout";
import Footers from "global/components/Footers";
import Header from "reader/components/Header";
import { useBodyClass } from "hooks";
import { ReaderContext } from "app/contexts";
import { SearchProvider } from "hooks/useSearch/context";
import FatalError from "global/components/FatalError";
import formatError from "app/routes/utility/helpers/formatError";

const STATUSES = [404, 401, 403, 500];

export function ErrorBoundary() {
  const error = useRouteError();
  const text = useLoaderData();
  const location = useLocation();

  useBodyClass("reader scheme-light");

  if (
    isRouteErrorResponse(error) ||
    (!!error.status && STATUSES.includes(error.status))
  ) {
    const errorProps = formatError(error, location.pathname);

    return (
      <ReaderContext.Provider>
        <SearchProvider>
          <Header text={text} />
          <main
            id="skip-to-main"
            tabIndex={-1}
            className="main-content flex-viewport"
          >
            <FatalError {...errorProps} contained />
          </main>
        </SearchProvider>
        <Footers.ReaderFooter text={text} />
        <Layout.PostFooter />
      </ReaderContext.Provider>
    );
  }

  throw error;
}
