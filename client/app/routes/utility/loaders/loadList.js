import { ApiClient } from "api";
import { routerContext } from "app/contexts";
import parseListParams from "./parseListParams";

export default async function ListLoader({
  request,
  context,
  fetchFn,
  options = {}
}) {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const url = new URL(request.url);
  const { filters, pagination } = parseListParams(url, options);

  const result = await client.call(fetchFn(filters, pagination));

  return { data: result.data ?? [], meta: result.meta ?? null };
}
