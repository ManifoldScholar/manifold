import { projectsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadAllPagesParallel from "lib/react-router/loaders/loadAllPagesParallel";
import DetailLayout from "components/lti/Detail";

export const loader = async ({ params, request, context }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });

  const { resources, collections } = await loadAllPagesParallel({
    context,
    fetchFns: {
      resources: () => projectsAPI.resources(params.id),
      collections: () => projectsAPI.resourceCollections(params.id)
    }
  });

  return {
    project,
    resources: resources.data,
    collections: collections.data
  };
};

export default function LtiStyledDetail({
  loaderData: { project, resources, collections }
}) {
  const texts = project.relationships?.texts ?? [];

  const categories = [
    { type: "text", collection: texts },
    { type: "resource", collection: resources },
    { type: "resourceCollection", collection: collections }
  ];

  return (
    <DetailLayout type="project" entity={project} categories={categories} />
  );
}
