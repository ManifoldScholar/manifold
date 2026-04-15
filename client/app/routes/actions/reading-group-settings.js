import { redirect } from "react-router";
import { readingGroupsAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

/**
 * Shared action for reading group settings routes.
 * Handles both update and duplicate operations.
 *
 * @param {Object} params
 * @param {Request} params.request - Form request
 * @param {Object} params.context - Router context
 * @param {Object} params.params - Route params
 * @returns {Promise<Object>} Action result with success/errors or redirect
 */
export default async function readingGroupSettings({
  request,
  context,
  params
}) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return { errors: [{ detail: "Unauthorized" }] };
  }

  const requestData = await request.json();
  const { intent, ...data } = requestData;

  // Determine parent route from request URL
  const url = new URL(request.url);
  const pathname = url.pathname;
  let parentRoute = `/groups/${params.id}`;

  if (pathname.includes("/annotations/settings")) {
    parentRoute = `/groups/${params.id}/annotations`;
  } else if (pathname.includes("/members/settings")) {
    parentRoute = `/groups/${params.id}/members`;
  }

  try {
    if (intent === "duplicate") {
      const { endpoint, method, ...duplicateData } = data;

      const result = await queryApi(
        {
          endpoint,
          method,
          options: {
            body: JSON.stringify({
              type: "readingGroups",
              data: {
                attributes: {
                  name: duplicateData.name,
                  archive: duplicateData.archive,
                  cloneOwnedAnnotations: duplicateData.copyAnnotations
                }
              }
            })
          }
        },
        context
      );

      if (result?.errors) {
        return { errors: result.errors };
      }

      const duplicateId = result?.data?.id;

      if (duplicateData.openOnProceed) {
        throw redirect(`/groups/${duplicateId}`);
      } else {
        throw redirect(parentRoute);
      }
    } else {
      // Update intent
      const { groupId, ...updateData } = data;

      const result = await queryApi(
        readingGroupsAPI.update(groupId, updateData),
        context
      );

      if (result?.errors) {
        return { errors: result.errors };
      }

      throw redirect(parentRoute);
    }
  } catch (error) {
    return handleActionError(error, "Failed to save reading group");
  }
}
