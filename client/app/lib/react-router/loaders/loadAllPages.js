/* eslint-disable no-console */
import { queryApi } from "api";

const CONCURRENCY = 4;

async function promiseMap(items, fn, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (cursor < items.length) {
        const i = cursor++;
        // eslint-disable-next-line no-await-in-loop
        results[i] = await fn(items[i], i);
      }
    }
  );
  await Promise.all(workers);
  return results;
}

function buildPagedRequest(request, pageNumber) {
  return {
    ...request,
    options: {
      ...request.options,
      params: {
        ...request.options?.params,
        page: { ...(request.options?.params?.page ?? {}), number: pageNumber }
      }
    }
  };
}

/**
 * Fetches all pages of a paginated request and returns a single merged result.
 * Recreates the eagerLoad behavior of the Redux entityStoreMiddleware.
 *
 * If `initial` is provided, it is used as page 1 (skipping a duplicate fetch).
 * Subsequent pages are fetched with bounded concurrency. The cloned request
 * carries the original page.size, so subsequent pages match by construction.
 *
 * Subpage failures are logged and the helper returns what it has — partial
 * data is better than none. AbortError propagates so RR can cancel.
 */
export default async function loadAllPages({
  request,
  context,
  signal,
  initial
} = {}) {
  const firstPage = initial ?? (await queryApi(request, context, signal));
  const totalPages = firstPage?.meta?.pagination?.totalPages ?? 1;
  if (totalPages <= 1) {
    return { data: firstPage?.data ?? [], meta: firstPage?.meta };
  }

  const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

  let rest;
  try {
    rest = await promiseMap(
      pageNumbers,
      n => queryApi(buildPagedRequest(request, n), context, signal),
      CONCURRENCY
    );
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    console.error("[loadAllPages] failed to fetch subsequent pages:", error);
    return { data: firstPage?.data ?? [], meta: firstPage?.meta };
  }

  return {
    data: [...(firstPage.data ?? []), ...rest.flatMap(r => r?.data ?? [])],
    meta: firstPage?.meta
  };
}
