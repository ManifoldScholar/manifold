import { ApiClient, passwordsAPI } from "api";

export async function action({ request }) {
  const data = await request.json();

  const client = new ApiClient();

  try {
    await client.call(passwordsAPI.create(data));
    return { success: true, email: data };
  } catch (error) {
    return {
      errors: [
        {
          detail: error.message || "Failed to send password reset",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}
