import { ApiClient, tokensAPI } from "api";
import normalizeApiError from "app/routes/utility/helpers/normalizeApiError";

const getErrorMessage = status => {
  switch (status) {
    case 502:
    case 500:
      return "The server was unreachable, or unable to fulfill your request.";
    default:
      return "The username or password you entered is incorrect";
  }
};

export async function action({ request }) {
  const data = await request.json();

  const client = new ApiClient();

  try {
    const result = await client.call(tokensAPI.loginForm(data));

    if (result?.errors) {
      return { errors: result.errors };
    }

    const authToken = result?.meta?.authToken;
    if (!authToken) {
      return {
        error: getErrorMessage(500)
      };
    }

    return { authToken };
  } catch (error) {
    // Normalize error to get status, then format with custom message
    const normalized = normalizeApiError(error);
    const status =
      normalized.errors?.[0]?.status ||
      error?.status ||
      error?.body?.status ||
      401;
    return {
      error: getErrorMessage(status)
    };
  }
}
