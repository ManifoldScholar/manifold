import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reads account-linking state from the current location's query string.
 *
 * During the LTI account-linking flow, the API redirects an existing user to
 * `/login?account_link={email}&account_link_token={token}` so they can confirm
 * ownership of that account before it is linked to an LMS login. An optional
 * `account_link_error` parameter carries a message from a failed attempt.
 * The token is opaque and must be passed through subsequent auth requests.
 *
 * @returns {{ email: ?string, token: ?string, error: ?string, isLinking: boolean }}
 */
export default function useAccountLink() {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const token = params.get("account_link_token");

    return {
      email: params.get("account_link"),
      token,
      error: params.get("account_link_error"),
      isLinking: !!token
    };
  }, [search]);
}
