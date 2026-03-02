import { readingGroupMembershipsAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return { errors: [{ detail: "Unauthorized" }] };
  }

  const data = await request.json();
  const { intent } = data;

  try {
    let result;

    if (intent === "join") {
      const { userId, readingGroupId } = data;
      if (!userId || !readingGroupId) {
        return { errors: [{ detail: "Missing userId or readingGroupId" }] };
      }
      result = await queryApi(
        readingGroupMembershipsAPI.create({ userId, readingGroupId }),
        context
      );
    } else if (intent === "join-via-link") {
      const { endpoint, method } = data;
      if (!endpoint?.startsWith("/api/v1/")) {
        return { errors: [{ detail: "Invalid endpoint" }] };
      }
      result = await queryApi({ endpoint, method, options: {} }, context);
    } else if (intent === "leave") {
      const { membershipId } = data;
      if (!membershipId) {
        return { errors: [{ detail: "Missing membershipId" }] };
      }
      result = await queryApi(
        readingGroupMembershipsAPI.destroy(membershipId),
        context
      );
    } else {
      return { errors: [{ detail: "Invalid intent" }] };
    }

    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
