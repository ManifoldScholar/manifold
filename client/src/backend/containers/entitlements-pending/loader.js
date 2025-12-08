import dataLoader from "helpers/router/loaders/dataLoader";
import { pendingEntitlementsAPI } from "api";

export default async function loader({ request, context }) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const pagination = {
    number: page,
    size: 10
  };

  const filters = Object.fromEntries(
    Array.from(searchParams.entries()).filter(([key]) => key !== "page")
  );

  const { requestKey } = await dataLoader({
    request: [pendingEntitlementsAPI.index, filters, pagination],
    context
  });

  return { requestKey };
}
