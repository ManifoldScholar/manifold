import { usersAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request }) {
  const data = await request.json();

  try {
    const result = await queryApi(usersAPI.create(data));

    if (result?.errors) {
      return { errors: result.errors };
    }

    return {
      success: true,
      email: data.attributes?.email,
      password: data.attributes?.password
    };
  } catch (error) {
    return handleActionError(error);
  }
}
