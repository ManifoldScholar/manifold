import { tokensAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";

const getErrorMessage = status => {
  if (status >= 500) {
    return "The server was unreachable, or unable to fulfill your request.";
  }
  return "The username or password you entered is incorrect";
};

export async function action({ request }) {
  const data = await request.json();

  try {
    const result = await queryApi(tokensAPI.loginForm(data));

    if (result?.errors) {
      return { errors: result.errors };
    }

    const authToken = result?.meta?.authToken;
    if (!authToken) {
      return { errors: [{ detail: getErrorMessage(500) }] };
    }

    return { authToken };
  } catch (error) {
    const status =
      error?.body?.errors?.[0]?.status ||
      error?.status ||
      error?.body?.status ||
      500;
    return { errors: [{ detail: getErrorMessage(status) }] };
  }
}
