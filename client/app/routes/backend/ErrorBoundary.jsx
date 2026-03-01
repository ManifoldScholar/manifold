import { useRouteError, isRouteErrorResponse, useLocation } from "react-router";
import Layout from "backend/components/layout";
import BodyClass from "hoc/BodyClass";
import Footers from "global/components/Footers";
import FatalError from "global/components/FatalError";
import formatError from "app/routes/utility/helpers/formatError";
import { useScrollToTop } from "hooks";

const STATUSES = [404, 401, 403, 500];

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  useScrollToTop();

  if (
    isRouteErrorResponse(error) ||
    (!!error.status && STATUSES.includes(error.status))
  ) {
    const errorProps = formatError(error, location.pathname);

    return (
      <BodyClass className="backend bg-neutral90">
        <>
          <Layout.GlobalHeader />
          <div className="main-content">
            <FatalError {...errorProps} contained />
          </div>
          <Footers.FrontendFooter withVersion />
        </>
      </BodyClass>
    );
  }

  throw error;
}
