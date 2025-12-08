import dataLoader from "helpers/router/loaders/dataLoader";
import { journalsAPI } from "api";

export default async function loader({ params, request, context }) {
  const { id: journalId } = params;
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

  // Add default filter if not present
  const finalFilters = {
    withUpdateAbility: true,
    ...filters
  };

  const { requestKey } = await dataLoader({
    request: [journalsAPI.journalIssues, journalId, pagination, finalFilters],
    context
  });

  return { requestKey };
}
