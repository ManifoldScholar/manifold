import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleLoaderError from "app/routes/utility/helpers/handleLoaderError";

export default async function EntityLoader({ context, fetchFn }) {
  try {
    const entity = await queryApi(fetchFn(), context);

    if (!entity?.data) {
      throw new Error("Entity not found");
    }

    return entity.data;
  } catch (error) {
    handleLoaderError(error);
  }
}
