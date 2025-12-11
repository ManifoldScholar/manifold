import { useRouteError, useLocation } from "react-router";
import { formatError } from "./Boundary";
import AppFatalError from "./AppWrapper";

export default function RouteErrorElement() {
  const error = useRouteError();
  const location = useLocation();

  if (error.data) {
    return (
      <AppFatalError
        fatalError={{
          error: {
            status: error.status,
            method: error.data.method,
            heading: error.data.heading
          }
        }}
        headerLineOne="errors.access_denied.header"
        headerLineTwo=""
        userMessage={error.data.userMessage}
        contained={error.data.contained}
        hideStatus={error.data.hideStatus}
      />
    );
  }

  return (
    <AppFatalError
      fatalError={formatError(error)}
      redirectPath={location.pathname}
    />
  );
}
