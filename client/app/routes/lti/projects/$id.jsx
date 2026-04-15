import { projectsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import LinkToggle from "components/lti/LinkToggle";
import LtiRow from "components/lti/Row";
import * as Styled from "../styles";
import { useSelection } from "../selectionContext";

export const handle = {
  breadcrumb: ({ loaderData, params }) => {
    const title = loaderData?.project?.attributes?.titlePlaintext;
    return [
      { label: "Projects", to: "/lti/projects" },
      title
        ? { label: title, to: `/lti/projects/${params.id}` }
        : null
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

export default function LtiProjectDetail({ loaderData }) {
  const { project, resources } = loaderData;
  const { titlePlaintext, subtitle, textsNav } = project.attributes ?? {};
  const texts = textsNav ?? [];
  const { add, remove, has } = useSelection();

  const projectItem = {
    type: "project",
    id: project.id,
    title: titlePlaintext
  };
  const projectSelected = has(projectItem);

  const projectTrail = [
    { label: "Projects", to: "/lti/projects" },
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
              ? `Remove ${titlePlaintext}`
              : `Add ${titlePlaintext}`
          }
        />
      </Styled.HeaderRow>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}

      <h2>Texts</h2>
      {texts.length === 0 ? (
        <Styled.Empty>No texts.</Styled.Empty>
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

      <h2>Resources</h2>
      {resources.length === 0 ? (
        <Styled.Empty>No resources.</Styled.Empty>
      ) : (
        <Styled.List>
          {resources.map(resource => {
            const { titlePlaintext: rTitle } = resource.attributes ?? {};
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
