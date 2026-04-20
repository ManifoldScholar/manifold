import { usersAPI, tokensAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const createResult = await queryApi(usersAPI.create(data), context);
    if (createResult?.errors) return { errors: createResult.errors };

    const email = data.attributes?.email;
    const password = data.attributes?.password;

    // Exchange the new credentials for an auth token server-side so the
    // password never crosses the action/fetcher boundary.
    let authToken = null;
    try {
      const tokenResult = await queryApi(
        tokensAPI.loginForm({ email, password }),
        context
      );
      authToken = tokenResult?.meta?.authToken ?? null;
    } catch {
      // Account was created; auto-login failed (e.g. pending verification).
      // Still report success so the UI shows the created state.
    }

    return { success: true, authToken };
  } catch (error) {
    return handleActionError(error);
  }
}
