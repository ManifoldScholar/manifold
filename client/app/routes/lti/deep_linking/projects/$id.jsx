import { projectsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadAllPagesParallel from "lib/react-router/loaders/loadAllPagesParallel";
import DetailLayout from "components/lti/Detail";

const FILTERS = {};
const PAGE_SIZE = { size: 200 };

export const loader = async ({ params, context, url, request }) => {
  const { id } = params;
  const [project, lists] = await Promise.all([
    loadEntity({ context, fetchFn: () => projectsAPI.show(id), url }),
    loadAllPagesParallel({
      context,
      signal: request?.signal,
      fetchFns: {
        resources: () => projectsAPI.resources(id, FILTERS, PAGE_SIZE),
        collections: () =>
          projectsAPI.resourceCollections(id, FILTERS, PAGE_SIZE)
      }
    })
  ]);

  return {
    project,
    resources: lists.resources.data,
    collections: lists.collections.data
  };
};

export default function LtiProjectDetailRoute({
  loaderData: { project, resources, collections }
}) {
  const texts = project.relationships?.texts ?? [];

  const categories = [
    { type: "text", collection: texts },
    { type: "resource", collection: resources ?? [] },
    { type: "resourceCollection", collection: collections ?? [] }
  ];

  return (
    <DetailLayout type="project" entity={project} categories={categories} />
  );
}
