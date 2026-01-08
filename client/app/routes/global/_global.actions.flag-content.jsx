import { annotationsAPI, commentsAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

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

  try {
    let result;

    if (intent === "flag") {
      if (type === "annotations") {
        result = await queryApi(annotationsAPI.flag(id, message), context);
      } else if (type === "comments") {
        result = await queryApi(commentsAPI.flag(id), context);
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
        result = await queryApi(annotationsAPI.unflag(id), context);
      } else if (type === "comments") {
        result = await queryApi(commentsAPI.unflag(id), context);
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
    return handleActionError(error, "Failed to flag content");
  }
}
