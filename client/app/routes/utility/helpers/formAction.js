import { redirect } from "react-router";
import { routerContext } from "app/contexts";
import { queryApi } from "./queryApi";
import handleActionError from "./handleActionError";
import unauthorizedError from "./unauthorizedError";

export default function formAction({
  mutation,
  redirectTo,
  errorMessage,
  requireAuth = false
}) {
  return async function action({ request, context, params }) {
    if (requireAuth) {
      const { auth } = context.get(routerContext) ?? {};
      if (!auth?.authToken) return unauthorizedError();
    }
    const data = await request.json();
    try {
      const result = await queryApi(mutation({ data, params }), context);
      if (result?.errors) return { errors: result.errors };
      if (redirectTo) throw redirect(redirectTo({ result, params }));
      return { success: true };
    } catch (error) {
      return handleActionError(error, errorMessage);
    }
  };
}
