import { useRouteError, isRouteErrorResponse, useLocation } from "react-router";
import Layout from "components/backend/layout";
import { useBodyClass } from "hooks";
import Footers from "components/global/Footers";
import FatalError from "components/global/FatalError";
import formatError from "lib/react-router/helpers/formatError";
import { useScrollToTop } from "hooks";

const STATUSES = [404, 401, 403, 500];

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  useScrollToTop();

  useBodyClass("backend bg-neutral90");

  if (
    isRouteErrorResponse(error) ||
    (!!error.status && STATUSES.includes(error.status))
  ) {
    const errorProps = formatError(error, location.pathname);

    return (
      <>
        <Layout.GlobalHeader />
        <div className="main-content bg-neutral90">
          <FatalError {...errorProps} contained />
        </div>
        <Footers.FrontendFooter withVersion />
      </>
    );
  }

  throw error;
}
