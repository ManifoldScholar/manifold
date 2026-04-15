import { useState } from "react";
import { textsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import LinkToggle from "components/lti/LinkToggle";
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

function TocNode({ node, depth, textTitle }) {
  const { add, remove, has } = useSelection();
  const [hovered, setHovered] = useState(false);
  const isAnchor = Boolean(node.anchor);
  const item = {
    type: "section",
    id: node.id,
    title: textTitle ? `${textTitle} — ${node.label}` : node.label
  };
  const selected = has(item);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <Styled.TocItem>
      <Styled.TocRow
        $selected={selected}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <Styled.TocLabel>{node.label}</Styled.TocLabel>
        {!isAnchor ? (
          <Styled.TocAddSlot>
            <LinkToggle
              selected={selected}
              onToggle={() => (selected ? remove(item) : add(item))}
              hiddenIfUnlinked={!hovered}
              srLabel={selected ? `Remove ${node.label}` : `Add ${node.label}`}
            />
          </Styled.TocAddSlot>
        ) : null}
      </Styled.TocRow>
      {hasChildren ? (
        <Styled.TocSublist $level={depth + 1}>
          {node.children.map(child => (
            <TocNode
              key={child.id}
              node={child}
              depth={depth + 1}
              textTitle={textTitle}
            />
          ))}
        </Styled.TocSublist>
      ) : null}
    </Styled.TocItem>
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
        <Styled.Toc>
          <Styled.TocList>
            {toc.map(node => (
              <TocNode
                key={node.id}
                node={node}
                depth={0}
                textTitle={titlePlaintext}
              />
            ))}
          </Styled.TocList>
        </Styled.Toc>
      ) : (
        <Styled.TocEmpty>
          This text does not have a table of contents.
        </Styled.TocEmpty>
      )}
    </>
  );
}
