import normalizeApiError from "./normalizeApiError";

/**
 * Formats route errors for display in error boundaries.
 * Handles 404, 401, and 403 errors with appropriate formatting.
 *
 * @param {Object} error - Route error from useRouteError()
 * @param {string} pathname - Current pathname from useLocation()
 * @returns {Object} Formatted error props for FatalError component
 */
export default function formatRouteError(error, pathname) {
  // Error may be thrown directly (with body.errors) or wrapped in data()
  const errorData = error.data;
  const errorBody = error.body;

  // Extract detail messages from API errors (JSON:API format)
  const apiErrors = errorBody?.errors || errorData?.body?.errors;
  const firstErrorDetail = apiErrors?.[0]?.detail;

  const isAuthError = error.status === 401 || error.status === 403;
  const hasFormattedData =
    errorData &&
    typeof errorData === "object" &&
    (errorData.heading || errorData.userMessage);

  let fatalError;
  let contained = false;
  let hideStatus = false;
  let userMessage = null;
  let headerLineOne = null;
  let headerLineTwo = null;

  if (error.status === 404) {
    fatalError = {
      type: "HTTP_RESPONSE",
      error: {
        status: 404,
        heading: "Page not found",
        body: null
      }
    };
    contained = true;
  } else if (isAuthError) {
    // Format auth errors with logic from AppWrapper.js
    // Prefer API error detail, then errorData body, then statusText
    const errorBodyText =
      firstErrorDetail || errorData?.body || error.statusText || null;
    const title =
      errorBodyText
        ?.replace("You are not authorized to read ", "")
        .replace(".", "") ?? "this content";
    const isRG = pathname.includes("groups");
    const isAdmin = pathname.includes("backend");
    const isPost = errorData?.method === "POST";

    fatalError = {
      type: "HTTP_RESPONSE",
      error: {
        status: error.status,
        heading: errorData?.heading || "Access Denied",
        body: errorBodyText,
        method: errorData?.method || null
      }
    };
    contained = errorData?.contained ?? true;
    hideStatus = errorData?.hideStatus ?? true;
    headerLineOne = "errors.access_denied.header";
    headerLineTwo = "";

    // Determine userMessage based on conditions (matching AppWrapper.js logic)
    if (hasFormattedData && errorData.userMessage) {
      // Use userMessage from error data if provided
      userMessage = errorData.userMessage;
    } else if (isPost) {
      // POST requests use error body directly (already a string, not a translation key)
      userMessage = errorBodyText;
    } else if (isRG) {
      // Reading group routes - pass translation keys
      userMessage = isAdmin
        ? "errors.access_denied.authorization_admin_reading_group"
        : "errors.access_denied.authorization_reading_group";
    } else {
      // Default authorization message with title interpolation
      userMessage = ["errors.access_denied.authorization", { title }];
    }
  } else {
    // Other errors - use normalizeApiError, but prefer API error details
    const normalized = normalizeApiError(error);
    const firstNormalizedError = normalized.errors?.[0];
    const apiErrorDetail = apiErrors?.[0]?.detail;

    fatalError = {
      type: "HTTP_RESPONSE",
      error: {
        status: firstNormalizedError?.status || error.status || 500,
        heading: "Error",
        // Prefer API error detail, then normalized error detail, then statusText
        body:
          apiErrorDetail ||
          firstNormalizedError?.detail ||
          error.statusText ||
          "An error occurred"
      }
    };
    contained = true;
  }

  return {
    fatalError,
    contained,
    hideStatus,
    userMessage,
    headerLineOne,
    headerLineTwo
  };
}
