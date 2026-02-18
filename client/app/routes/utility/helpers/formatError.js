import { isRouteErrorResponse } from "react-router";

function formatAuthError(error, pathname) {
  const { data, body } = error ?? {};

  const formattedBody = body?.errors?.[0].detail ?? "";
  const title =
    formattedBody
      ?.replace("You are not authorized to read ", "")
      .replace(".", "") ?? "this content";
  const isRG = pathname.includes("groups");
  const isAdmin = pathname.includes("backend");

  const fatalError = {
    type: "HTTP_RESPONSE",
    error: {
      status: error.status,
      heading: data?.heading || "Access Denied",
      body: formattedBody,
      method: data?.method
    }
  };

  let userMessage;

  // If this came from authorize loader and includes a preset message, use that
  if (data?.message) {
    userMessage = data.message;
  } else if (isRG) {
    userMessage = isAdmin
      ? "errors.access_denied.authorization_admin_reading_group"
      : "errors.access_denied.authorization_reading_group";
  } else {
    userMessage = ["errors.access_denied.authorization", { title }];
  }

  return {
    fatalError,
    hideStatus: true,
    headerLineOne: "errors.access_denied.header",
    headerLineTwo: null,
    userMessage
  };
}

function formatHttpError(error, pathname) {
  const isAuthError = error.status === 401 || error.status === 403;
  if (isAuthError) return formatAuthError(error, pathname);

  if (error.status === 404)
    return {
      fatalError: {
        type: "HTTP_RESPONSE",
        error: {
          status: 404,
          heading: "Page not found",
          body: null
        }
      }
    };

  const { body, data } = error ?? {};
  const apiErrors = body?.errors || data?.body?.errors;

  return {
    fatalError: {
      type: "HTTP_RESPONSE",
      error: {
        status: error.status,
        heading: error.statusText || "Error",
        body: apiErrors?.[0]?.detail || "An unexpected error occurred"
      }
    }
  };
}

/**
 * Unified error formatter for use in error boundaries and server rendering.
 * Handles route error responses, JS exceptions, legacy Response objects, and unknown errors.
 *
 * @param {*} error - Error from useRouteError() or a caught exception
 * @param {string} [pathname] - Current pathname, used for context-aware auth error messages
 * @returns {{ fatalError, hideStatus, userMessage, headerLineOne, headerLineTwo }}
 */
export default function formatError(error, pathname = "") {
  if (isRouteErrorResponse(error) || !!error.status) {
    return formatHttpError(error, pathname);
  }

  if (error instanceof Error) {
    return {
      fatalError: {
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
      }
    };
  }
  return {
    fatalError: {
      type: "UNKNOWN_ERROR",
      error: {
        status: 500,
        heading: "Error",
        body: String(error)
      }
    }
  };
}
