import { useParams } from "react-router";
import { projectsAPI } from "api";
import { useFetch } from "hooks";
import DetailLayout from "lti/components/Detail";

const FILTERS = {};
const PAGE_SIZE = { size: 200 };

export default function LtiProjectDetail() {
  const { id } = useParams();

  const { data: project } = useFetch({ request: [projectsAPI.show, id] });
  const { data: resources } = useFetch({
    request: [projectsAPI.resources, id, FILTERS, PAGE_SIZE, true]
  });
  const { data: collections } = useFetch({
    request: [projectsAPI.resourceCollections, id, FILTERS, PAGE_SIZE, true]
  });

  if (!project) return null;

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

LtiProjectDetail.displayName = "Lti.ProjectDetailContainer";
