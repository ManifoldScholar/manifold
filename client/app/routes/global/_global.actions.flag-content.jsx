import { annotationsAPI, commentsAPI } from "api";
import { routerContext } from "app/contexts";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";

/**
 * Shared action for flagging/unflagging annotations and comments.
 * Handles both flag and unflag operations.
 *
 * @param {Object} params
 * @param {Request} params.request - Form request
 * @param {Object} params.context - Router context
 * @returns {Promise<Object>} Action result with success/errors
 */
export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return { errors: [{ detail: "Unauthorized" }] };
  }

  const data = await request.json();
  const { intent, type, id, message = "" } = data;

  if (!intent || !type || !id) {
    return {
      errors: [
        {
          detail: "Missing required fields",
          source: { pointer: "/data" }
        }
      ]
    };
  }

  const client = getApiClient(context);

  try {
    let result;

    if (intent === "flag") {
      if (type === "annotations") {
        result = await client.call(annotationsAPI.flag(id, message));
      } else if (type === "comments") {
        result = await client.call(commentsAPI.flag(id));
      } else {
        return {
          errors: [
            {
              detail: "Invalid type",
              source: { pointer: "/data/type" }
            }
          ]
        };
      }
    } else if (intent === "unflag") {
      if (type === "annotations") {
        result = await client.call(annotationsAPI.unflag(id));
      } else if (type === "comments") {
        result = await client.call(commentsAPI.unflag(id));
      } else {
        return {
          errors: [
            {
              detail: "Invalid type",
              source: { pointer: "/data/type" }
            }
          ]
        };
      }
    } else {
      return {
        errors: [
          {
            detail: "Invalid intent",
            source: { pointer: "/data/intent" }
          }
        ]
      };
    }

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true, data: result?.data };
  } catch (error) {
    return {
      errors: [
        {
          detail: error.message || "Failed to flag content",
          source: { pointer: "/data" }
        }
      ]
    };
  }
}
