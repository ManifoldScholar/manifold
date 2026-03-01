import { redirect } from "react-router";
import { notificationPreferencesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";

export const loader = async ({ params, context }) => {
  try {
    await queryApi(
      notificationPreferencesAPI.unsubscribe(params.token),
      context
    );
  } catch (error) {
    // Continue even if unsubscribe fails
    console.error("Failed to unsubscribe:", error);
  }

  // Always redirect to home after unsubscribe attempt
  throw redirect("/");
};
