import { redirect } from "react-router";
import { queryApi } from "./queryApi";
import handleActionError from "./handleActionError";

export default function formAction({ mutation, redirectTo }) {
  return async function action({ request, context, params }) {
    const data = await request.json();
    try {
      const result = await queryApi(mutation({ data, params }), context);
      if (result?.errors) return { errors: result.errors };
      if (redirectTo) throw redirect(redirectTo({ result, params }));
      return { success: true };
    } catch (error) {
      return handleActionError(error);
    }
  };
}
