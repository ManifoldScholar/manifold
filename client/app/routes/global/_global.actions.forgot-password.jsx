import { passwordsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request }) {
  const data = await request.json();

  try {
    await queryApi(passwordsAPI.create(data));
    return { success: true, email: data };
  } catch (error) {
    return handleActionError(error);
  }
}
