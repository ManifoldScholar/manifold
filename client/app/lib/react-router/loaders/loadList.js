import { queryApi } from "api";
import handleLoaderError from "lib/react-router/helpers/handleLoaderError";
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

    const args = [
      !options?.skipFilters ? filters : undefined,
      !options?.skipPagination ? pagination : undefined
    ].filter(v => v !== undefined);

    const result = await queryApi(fetchFn(...args), context);

    return { data: result.data ?? [], meta: result.meta ?? null };
  } catch (error) {
    handleLoaderError(error);
  }
}
