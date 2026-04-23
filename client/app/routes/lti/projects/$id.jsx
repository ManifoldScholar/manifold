import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
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

  const { resources, collections } = await loadParallelLists({
    context,
    fetchFns: {
      resources: () =>
        projectsAPI.resources(params.id, {}, { number: 1, size: 50 }),
      collections: () =>
        projectsAPI.resourceCollections(params.id, {}, { number: 1, size: 50 })
    }
  });

  return {
    project,
    resources: resources ?? [],
    collections: collections ?? []
  };
};

export default function LtiStyledDetail({
  loaderData: { project, resources, collections }
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
      <h2>{t("lti.lists.resource_collections_heading")}</h2>
      <BrowseList noPagination>
        {collections.map(collection => {
          const {
            titlePlaintext: cTitle,
            title: cTitleFallback
          } = collection.attributes;
          const title = cTitle ?? cTitleFallback;
          const item = {
            type: "resourceCollection",
            id: collection.id,
            title
          };
          const selected = has(item);
          return (
            <LtiRow
              key={collection.id}
              entity={collection}
              kind="resourceCollection"
              to={`/lti/resource-collections/${collection.id}`}
              linkState={{ trail: projectTrail }}
              selected={selected}
              onToggle={() => (selected ? remove(item) : add(item))}
            />
          );
        })}
      </BrowseList>
      <h2>{t("lti.lists.resources_heading")}</h2>
      <BrowseList noPagination>
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
