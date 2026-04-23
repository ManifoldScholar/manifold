import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadList from "lib/react-router/loaders/loadList";
import LtiRow from "components/lti/Row";
import BrowseList from "components/lti/BrowseList";
import EntityHeader from "components/lti/EntityHeader";
import { useSelection } from "contexts";

export const handle = {
  breadcrumb: ({ loaderData, params }, location, t) => {
    const title = loaderData?.project?.attributes?.titlePlaintext;
    return [
      { label: t("lti.breadcrumb.projects"), to: "/lti/projects" },
      title ? { label: title, to: `/lti/projects/${params.id}` } : null
    ].filter(Boolean);
  }
};

export const loader = async ({ params, request, context }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });

  const resources = await loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      projectsAPI.resources(params.id, filters, pagination),
    options: { defaultPagination: { page: 1, perPage: 50 } }
  });

  return { project, resources: resources.data, resourcesMeta: resources.meta };
};

export default function LtiStyledDetail({
  loaderData: { project, resources, resourcesMeta }
}) {
  const { t } = useTranslation();
  const { titlePlaintext, subtitle, textsNav } = project.attributes;
  const texts = textsNav ?? [];
  const { add, remove, has } = useSelection();

  const projectTrail = [
    { label: t("lti.breadcrumb.projects"), to: "/lti/projects" },
    { label: titlePlaintext, to: `/lti/projects/${project.id}` }
  ];

  return (
    <>
      <EntityHeader
        id={project.id}
        type="project"
        title={titlePlaintext}
        subtitle={subtitle}
      />
      <h2>{t("lti.lists.texts_heading")}</h2>
      <BrowseList noPagination>
        {texts.map(text => {
          const item = { type: "text", id: text.id, title: text.label };
          const selected = has(item);
          return (
            <LtiRow
              key={text.id}
              entity={{
                id: text.id,
                type: "text",
                attributes: {
                  titlePlaintext: text.label,
                  coverStyles: {}
                }
              }}
              kind="text"
              to={`/lti/texts/${text.id}`}
              linkState={{ trail: projectTrail }}
              selected={selected}
              onToggle={() => (selected ? remove(item) : add(item))}
            />
          );
        })}
      </BrowseList>
      <h2>{t("lti.lists.resources_heading")}</h2>
      <BrowseList meta={resourcesMeta}>
        {resources.map(resource => {
          const { titlePlaintext: rTitle } = resource.attributes;
          const item = {
            type: "resource",
            id: resource.id,
            title: rTitle
          };
          const selected = has(item);
          return (
            <LtiRow
              key={resource.id}
              entity={resource}
              kind="resource"
              to={`/lti/resources/${resource.id}`}
              linkState={{ trail: projectTrail }}
              selected={selected}
              onToggle={() => (selected ? remove(item) : add(item))}
            />
          );
        })}
      </BrowseList>
    </>
  );
}
