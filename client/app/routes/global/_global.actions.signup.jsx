import { ApiClient, usersAPI } from "api";
import handleActionError from "app/routes/utility/helpers/handleActionError";

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
    return handleActionError(error, "Failed to create account");
  }
}
