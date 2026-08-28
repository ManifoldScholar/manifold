import { data } from "react-router";

/**
 * Handles errors in route loaders by throwing to the nearest boundary.
 *
 * API failures arrive as plain `{ status, statusText, body }` objects from the
 * api client. They are rethrown as route error responses so React Router
 * sets the HTTP status of the document response; boundaries read the API
 * payload from `error.data`. Real `Response`s (redirects, `data()` throws)
 * pass through untouched. Non-Response errors (loader-body bugs, null
 * derefs, bad args, malformed URLs, etc.) default to 500 rather than
 * masquerading as 404.
 *
 * @param {Error|Object|Response} error - The error to handle
 * @throws {Response} Always throws a Response object
 */
export default function handleLoaderError(error) {
  if (error instanceof Response) throw error;
  if (error?.status) {
    throw data(error.body ?? null, {
      status: error.status,
      statusText: error.statusText
    });
  }
  if (error?.body?.status) {
    throw data(error.body, { status: error.body.status });
  }

  // eslint-disable-next-line no-console
  console.error("[handleLoaderError] non-Response error:", error);
  throw data(
    { message: error?.message ?? "Unexpected loader error" },
    { status: 500 }
  );
}
