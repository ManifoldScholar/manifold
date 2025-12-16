import { ApiClient, meAPI } from "api";
import { routerContext } from "app/contexts";

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

  const formData = await request.formData();
  const data = JSON.parse(formData.get("data"));

  const client = new ApiClient(auth.authToken);

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
