import {
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useLocation
} from "react-router";
import Layout from "components/reader/layout";
import Footers from "components/global/Footers";
import Header from "components/reader/Header";
import { useBodyClass } from "hooks";
import { SearchProvider } from "hooks/useSearch/context";
import FatalError from "components/global/FatalError";
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
      <>
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
      </>
    );
  }

  throw error;
}
