import { ApiClient } from "api";
import { routerContext } from "app/contexts";
import cookie from "js-cookie";

export function getApiClient(context = null) {
  let authToken = null;

  if (context) {
    // Server-side: get from context
    const { auth } = context.get(routerContext) ?? {};
    authToken = auth?.authToken;
  } else {
    // Client-side: get from cookie
    authToken = cookie.get("authToken");
  }

  return new ApiClient(authToken);
}
