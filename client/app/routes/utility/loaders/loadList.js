import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleLoaderError from "app/routes/utility/helpers/handleLoaderError";
import parseListParams from "./parseListParams";

export default async function ListLoader({
  request,
  context,
  fetchFn,
  options = {}
}) {
  try {
    const url = new URL(request.url);
    const { filters, pagination } = parseListParams(url, options);

    const result = await queryApi(fetchFn(filters, pagination), context);

    return { data: result.data ?? [], meta: result.meta ?? null };
  } catch (error) {
    handleLoaderError(error);
  }
}
