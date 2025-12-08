import dataLoader from "helpers/router/loaders/dataLoader";
import { subjectsAPI, requests } from "api";

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
    request: [subjectsAPI.index, filters, pagination],
    context,
    requestKey: requests.beSubjects
  });

  return { requestKey };
}
