import { ApiClient } from "api";
import { data } from "react-router";
import { routerContext } from "app/contexts";

export default async function EntityLoader({ context, fetchFn }) {
  const { auth } = context.get(routerContext);
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  try {
    const entity = await client.call(fetchFn());

    if (!entity?.data) {
      throw data(null, { status: 404 });
    }

    return entity.data;
  } catch (error) {
    // If it's already a Response (redirect or data), re-throw it
    if (error instanceof Response) {
      throw error;
    }
    // Otherwise, treat API errors as 404
    throw data(null, { status: 404 });
  }
}
