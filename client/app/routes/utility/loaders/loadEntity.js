import { queryApi } from "api";
import handleLoaderError from "app/routes/utility/helpers/handleLoaderError";
import { data } from "react-router";
import requireLogin from "./requireLogin";

export default async function EntityLoader({ context, fetchFn, request }) {
  try {
    const entity = await queryApi(fetchFn(), context);

    if (!entity?.data) {
      throw data("No entity data returned from api", { status: 404 });
    }

    return entity.data;
  } catch (error) {
    if (error.status === 401) return requireLogin(request, context);
    handleLoaderError(error);
  }
}
