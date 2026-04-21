import { useState } from "react";
import { useTranslation } from "react-i18next";
import LinkToggle from "components/lti/LinkToggle";
import { useSelection } from "contexts";
import * as Styled from "./styles";

export default function TocNode({ node, depth, textTitle }) {
  const { t } = useTranslation();
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
    <Styled.Item>
      <Styled.Row
        $selected={selected}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <Styled.Label>{node.label}</Styled.Label>
        {!isAnchor ? (
          <Styled.AddSlot>
            <LinkToggle
              selected={selected}
              onToggle={() => (selected ? remove(item) : add(item))}
              hiddenIfUnlinked={!hovered}
              srLabel={
                selected
                  ? t("lti.toggle.remove_item", { title: node.label })
                  : t("lti.toggle.add_item", { title: node.label })
              }
            />
          </Styled.AddSlot>
        ) : null}
      </Styled.Row>
      {hasChildren ? (
        <Styled.Sublist $level={depth + 1}>
          {node.children.map(child => (
            <TocNode
              key={child.id}
              node={child}
              depth={depth + 1}
              textTitle={textTitle}
            />
          ))}
        </Styled.Sublist>
      ) : null}
    </Styled.Item>
  );
}
