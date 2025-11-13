import { useRouteError, useLocation } from "react-router-dom";
import { formatError } from "./Boundary";
import AppFatalError from "./AppWrapper";

export default function RouteErrorElement() {
  const error = useRouteError();
  const location = useLocation();

  return (
    <AppFatalError
      fatalError={formatError(error)}
      redirectPath={location.pathname}
    />
  );
}
