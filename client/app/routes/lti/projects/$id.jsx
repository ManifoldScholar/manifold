import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
import LinkToggle from "components/lti/LinkToggle";
import LtiRow from "components/lti/Row";
import * as Styled from "./styles";
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

  const lists = await loadParallelLists({
    context,
    fetchFns: {
      resources: () => projectsAPI.resources(params.id, {}, { size: 50 })
    }
  });

  return { project, resources: lists.resources ?? [] };
};

export default function LtiStyledDetail({
  loaderData: { project, resources }
}) {
  const { t } = useTranslation();
  const { titlePlaintext, subtitle, textsNav } = project.attributes;
  const texts = textsNav ?? [];
  const { add, remove, has } = useSelection();

  const projectItem = {
    type: "project",
    id: project.id,
    title: titlePlaintext
  };
  const projectSelected = has(projectItem);

  const projectTrail = [
    { label: t("lti.breadcrumb.projects"), to: "/lti/projects" },
    { label: titlePlaintext, to: `/lti/projects/${project.id}` }
  ];

  return (
    <>
      <Styled.HeaderRow>
        <h1>{titlePlaintext}</h1>
        <LinkToggle
          selected={projectSelected}
          onToggle={() =>
            projectSelected ? remove(projectItem) : add(projectItem)
          }
          srLabel={
            projectSelected
              ? t("lti.toggle.remove_item", { title: titlePlaintext })
              : t("lti.toggle.add_item", { title: titlePlaintext })
          }
        />
      </Styled.HeaderRow>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}

      <h2>{t("lti.lists.texts_heading")}</h2>
      {texts.length === 0 ? (
        <Styled.Empty>{t("lti.lists.texts_empty")}</Styled.Empty>
      ) : (
        <Styled.List>
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
        </Styled.List>
      )}

      <h2>{t("lti.lists.resources_heading")}</h2>
      {resources.length === 0 ? (
        <Styled.Empty>{t("lti.lists.resources_empty")}</Styled.Empty>
      ) : (
        <Styled.List>
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
        </Styled.List>
      )}
    </>
  );
}
