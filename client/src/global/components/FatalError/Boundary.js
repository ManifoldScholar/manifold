import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import AppFatalError from "./AppWrapper";

export const formatError = error => {
  if (error instanceof Response) {
    return {
      type: "HTTP_RESPONSE",
      error: {
        status: error.status || 500,
        heading: error.status === 404 ? "Not Found" : "Error",
        body: error.statusText || "An error occurred"
      }
    };
  }

  if (error instanceof Error) {
    return {
      type: "JS_EXCEPTION",
      error: {
        status: 500,
        heading: "Client Javascript Exception",
        body:
          error.name === "Error"
            ? `"${error.message}"`
            : `"${error.name}: ${error.message}"`,
        clientTrace: error.stack,
        clientTraceTruncate: 5
      }
    };
  }

  return {
    type: "UNKNOWN_ERROR",
    error: {
      status: 500,
      heading: "Error",
      body: String(error)
    }
  };
};

export default function FatalErrorBoundary({ children }) {
  const location = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <AppFatalError
          fatalError={formatError(error)}
          dismiss={resetErrorBoundary}
          redirectPath={location.pathname}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

FatalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};
