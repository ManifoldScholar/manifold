import { getApiClient } from "app/routes/utility/helpers/getApiClient";
import parseListParams from "./parseListParams";

export default async function ListLoader({
  request,
  context,
  fetchFn,
  options = {}
}) {
  const client = getApiClient(context);

  const url = new URL(request.url);
  const { filters, pagination } = parseListParams(url, options);

  const result = await client.call(fetchFn(filters, pagination));

  return { data: result.data ?? [], meta: result.meta ?? null };
}
