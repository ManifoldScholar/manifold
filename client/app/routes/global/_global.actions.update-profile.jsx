import { meAPI } from "api";
import { routerContext } from "app/contexts";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return {
      errors: [
        {
          detail: "Authentication required",
          source: { pointer: "/data" }
        }
      ]
    };
  }

  const data = await request.json();

  const client = getApiClient(context);

  try {
    const result = await client.call(meAPI.update(data));

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return {
      errors: [
        {
          detail: error.message || "Failed to update profile",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}
