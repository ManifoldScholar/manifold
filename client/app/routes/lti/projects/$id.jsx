import { Link } from "react-router";
import { projectsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
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
        <Styled.AddButton
          type="button"
          onClick={() =>
            projectSelected ? remove(projectItem) : add(projectItem)
          }
          $selected={projectSelected}
          aria-label={
            projectSelected
              ? `Remove ${titlePlaintext}`
              : `Add ${titlePlaintext}`
          }
        >
          {projectSelected ? "✓ Added" : "+ Add project"}
        </Styled.AddButton>
      </Styled.HeaderRow>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}

      <h2>Texts</h2>
      {texts.length === 0 ? (
        <Styled.Empty>No texts.</Styled.Empty>
      ) : (
        <Styled.SelectableList>
          {texts.map(text => {
            const item = { type: "text", id: text.id, title: text.label };
            const selected = has(item);
            return (
              <Styled.SelectableItem key={text.id} $selected={selected}>
                <Link
                  to={`/lti/texts/${text.id}`}
                  state={{ trail: projectTrail }}
                >
                  {text.label}
                </Link>
                <Styled.AddButton
                  type="button"
                  onClick={() => (selected ? remove(item) : add(item))}
                  $selected={selected}
                  aria-label={
                    selected ? `Remove ${text.label}` : `Add ${text.label}`
                  }
                >
                  {selected ? "✓" : "+"}
                </Styled.AddButton>
              </Styled.SelectableItem>
            );
          })}
        </Styled.SelectableList>
      )}

      <h2>Resources</h2>
      {resources.length === 0 ? (
        <Styled.Empty>No resources.</Styled.Empty>
      ) : (
        <Styled.SelectableList>
          {resources.map(resource => {
            const { titlePlaintext: title, kind } = resource.attributes ?? {};
            const item = {
              type: "resource",
              id: resource.id,
              title: titlePlaintext ? `${titlePlaintext} — ${title}` : title
            };
            const selected = has(item);
            return (
              <Styled.SelectableItem key={resource.id} $selected={selected}>
                <Link
                  to={`/lti/resources/${resource.id}`}
                  state={{ trail: projectTrail }}
                >
                  {title}
                  {kind ? <Styled.ItemSub>{kind}</Styled.ItemSub> : null}
                </Link>
                <Styled.AddButton
                  type="button"
                  onClick={() => (selected ? remove(item) : add(item))}
                  $selected={selected}
                  aria-label={selected ? `Remove ${title}` : `Add ${title}`}
                >
                  {selected ? "✓" : "+"}
                </Styled.AddButton>
              </Styled.SelectableItem>
            );
          })}
        </Styled.SelectableList>
      )}
    </>
  );
}
