import { ApiClient, usersAPI } from "api";

export async function action({ request }) {
  const data = await request.json();

  const client = new ApiClient();

  try {
    const result = await client.call(usersAPI.create(data));

    if (result?.errors) {
      return { errors: result.errors };
    }

    return {
      success: true,
      email: data.attributes?.email,
      password: data.attributes?.password
    };
  } catch (error) {
    return {
      errors: [
        {
          detail: error.message || "Failed to create account",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}
