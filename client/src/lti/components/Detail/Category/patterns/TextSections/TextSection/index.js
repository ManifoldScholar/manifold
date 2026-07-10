import { useTranslation } from "react-i18next";
import { useSelection } from "lti/contexts";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function TextSection({ node, depth, textTitle }) {
  const { t } = useTranslation();

  const { add, remove, has } = useSelection();
  const item = {
    type: "textSection",
    id: node.id,
    title: textTitle ? `${textTitle} — ${node.label}` : node.label
  };
  const selected = has(item);

  return (
    <li>
      <Styled.Row $linkable={!node.anchor} $selected={selected}>
        <Styled.Label $depth={depth}>{node.label}</Styled.Label>
        {!node.anchor && (
          <Styled.AddButton
            type="button"
            $selected={selected}
            onClick={() => (selected ? remove(item) : add(item))}
            aria-pressed={selected}
            aria-label={t(
              selected ? "lti.toggle.remove_item" : "lti.toggle.add_item",
              { title: node.label }
            )}
          >
            <IconComposer
              icon={selected ? "checkmark16" : "plusCircle16"}
              size={16}
            />
            <span>{t(selected ? "lti.toggle.linked" : "lti.toggle.link")}</span>
          </Styled.AddButton>
        )}
      </Styled.Row>
      {!!node.children?.length && (
        <Styled.Sublist>
          {node.children.map(child => (
            <TextSection
              key={child.id}
              node={child}
              depth={depth + 1}
              textTitle={textTitle}
            />
          ))}
        </Styled.Sublist>
      )}
    </li>
  );
}
