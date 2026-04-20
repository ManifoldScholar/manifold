/**
 * Canonical unauthorized response shape for route actions.
 * Returned when an action requires authentication but no authToken is present.
 */
export default function unauthorizedError() {
  return {
    errors: [
      { detail: "Authentication required", source: { pointer: "/data" } }
    ]
  };
}
