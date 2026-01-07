import { getApiClient } from "app/routes/utility/helpers/getApiClient";

export default async function loadParallelLists({ context, fetchFns }) {
  const client = getApiClient(context);

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
