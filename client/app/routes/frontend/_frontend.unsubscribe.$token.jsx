import { redirect } from "react-router";
import { notificationPreferencesAPI } from "api";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";

export const loader = async ({ params, context }) => {
  const client = getApiClient(context);

  try {
    await client.call(notificationPreferencesAPI.unsubscribe(params.token));
  } catch (error) {
    // Continue even if unsubscribe fails
    console.error("Failed to unsubscribe:", error);
  }

  // Always redirect to home after unsubscribe attempt
  throw redirect("/");
};
