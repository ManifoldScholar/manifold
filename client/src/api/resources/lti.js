import LowLevelApiClient from "api/LowLevelApiClient";

// The LTI deep-linking endpoints return plain JSON (not JSON:API), so we call
// the low-level client directly and read the raw body rather than routing
// through the entity store, whose response handling assumes a JSON:API shape.

function readResponse(response) {
  return response.json().then(
    json => ({ ok: response.ok, status: response.status, json }),
    () => ({ ok: response.ok, status: response.status, json: null })
  );
}

function networkError(error) {
  return Promise.reject({ status: error?.response?.status ?? 503 });
}

function resolveOrReject({ ok, status, json }) {
  if (ok) return json ?? {};
  return Promise.reject({ status, errors: json?.errors });
}

export default {
  // GET /api/v1/lti/deep_linking?context_token=<token>
  // -> { accept_types: [...], accept_multiple: bool }
  fetchContext({ contextToken, authToken }) {
    const client = new LowLevelApiClient();
    return client
      .call("/api/v1/lti/deep_linking", "GET", {
        authToken,
        params: { contextToken }
      })
      .then(readResponse, networkError)
      .then(resolveOrReject);
  },

  // POST /api/v1/lti/deep_linking
  // body { context_token, selection: [{ type, id, title }] }
  // -> { deep_link_return_url, jwt }
  submit({ contextToken, selection, authToken }) {
    const client = new LowLevelApiClient();
    return client
      .call("/api/v1/lti/deep_linking", "POST", {
        authToken,
        body: JSON.stringify({ context_token: contextToken, selection })
      })
      .then(readResponse, networkError)
      .then(resolveOrReject);
  }
};
