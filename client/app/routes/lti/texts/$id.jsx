import { textsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import * as Styled from "../styles";
import { useSelection } from "../selectionContext";

export const handle = {
  breadcrumb: ({ loaderData, params }, location) => {
    const title = loaderData?.attributes?.titlePlaintext;
    const trail = location?.state?.trail;
    const base =
      Array.isArray(trail) && trail.length > 0
        ? trail
        : [{ label: "Texts", to: "/lti/texts" }];
    return [
      ...base,
      title ? { label: title, to: `/lti/texts/${params.id}` } : null
    ].filter(Boolean);
  }
};

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => textsAPI.show(params.id),
    request
  });
};

function TocTree({ nodes, textTitle }) {
  const { add, remove, has } = useSelection();
  if (!nodes?.length) return null;

  return (
    <ul>
      {nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0;
        const isAnchor = Boolean(node.anchor);
        const item = {
          type: "section",
          id: node.id,
          title: textTitle ? `${textTitle} — ${node.label}` : node.label
        };
        const selected = has(item);

        const addButton = isAnchor ? null : (
          <Styled.AddButton
            type="button"
            onClick={() => (selected ? remove(item) : add(item))}
            $selected={selected}
            aria-label={
              selected ? `Remove ${node.label}` : `Add ${node.label}`
            }
          >
            {selected ? "✓" : "+"}
          </Styled.AddButton>
        );

        if (hasChildren) {
          return (
            <li key={node.id}>
              <details>
                <summary>
                  <span>{node.label}</span>
                  {addButton}
                </summary>
                <TocTree nodes={node.children} textTitle={textTitle} />
              </details>
            </li>
          );
        }
        return (
          <li key={node.id}>
            <span className="lti-toc-leaf">{node.label}</span>
            {addButton}
          </li>
        );
      })}
    </ul>
  );
}

export default function LtiTextDetail({ loaderData: text }) {
  const { titlePlaintext, subtitle, toc } = text.attributes ?? {};

  return (
    <>
      <h1>{titlePlaintext}</h1>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}

      <h2>Table of contents</h2>
      {toc?.length ? (
        <Styled.TocList as="div">
          <TocTree nodes={toc} textTitle={titlePlaintext} />
        </Styled.TocList>
      ) : (
        <Styled.Empty>No table of contents.</Styled.Empty>
      )}
    </>
  );
}
