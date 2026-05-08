import loadAllPages from "./loadAllPages";

/**
 * Runs loadAllPages across multiple fetchFns in parallel and returns
 * { [key]: { data, meta } }, matching the shape loadParallelLists returns.
 *
 * `initials` is typically the loadParallelLists output from the server
 * loader; it carries each key's page-1 result (with meta) so we don't
 * refetch page 1 on the client.
 */
export default async function loadAllPagesParallel({
  context,
  signal,
  fetchFns,
  initials = {}
}) {
  const keys = Object.keys(fetchFns);
  const results = await Promise.all(
    keys.map(key =>
      loadAllPages({
        request: fetchFns[key](),
        initial: initials[key],
        context,
        signal
      })
    )
  );
  return Object.fromEntries(
    keys.map((key, i) => [
      key,
      { data: results[i]?.data ?? [], meta: results[i]?.meta ?? null }
    ])
  );
}
