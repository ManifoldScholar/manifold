import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import ProjectRow from "components/lti/ProjectRow";
import BrowseList from "components/lti/BrowseList";

export const handle = {
  breadcrumb: (match, location, t) => ({
    label: t("lti.breadcrumb.projects"),
    to: "/lti/projects"
  })
};

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: projectsAPI.index
  });
};

export default function LtiStyledsList({
  loaderData: { data: projects, meta }
}) {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("lti.lists.projects_heading")}</h1>
      <BrowseList meta={meta}>
        {projects.map(project => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </BrowseList>
    </>
  );
}
