import { ApiClient } from "api";
import { routerContext } from "app/contexts";

export default async function loadParallelLists({ context, fetchFns }) {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const keys = Object.keys(fetchFns);
  const promises = keys.map(key => client.call(fetchFns[key]()));

  const results = await Promise.allSettled(promises);

  const output = {};
  keys.forEach((key, index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      output[key] = result.value?.data;
    }
  });

  return output;
}
