import { ApiClient, passwordsAPI } from "api";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request }) {
  const data = await request.json();

  const client = new ApiClient();

  try {
    await client.call(passwordsAPI.create(data));
    return { success: true, email: data };
  } catch (error) {
    return handleActionError(error, "Failed to send password reset");
  }
}
