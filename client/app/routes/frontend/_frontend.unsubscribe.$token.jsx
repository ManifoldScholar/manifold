import { redirect } from "react-router";
import { ApiClient, notificationPreferencesAPI } from "api";
import { routerContext } from "app/contexts";

export const loader = async ({ params, context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  try {
    await client.call(notificationPreferencesAPI.unsubscribe(params.token));
  } catch (error) {
    // Continue even if unsubscribe fails
    console.error("Failed to unsubscribe:", error);
  }

  // Always redirect to home after unsubscribe attempt
  throw redirect("/");
};
