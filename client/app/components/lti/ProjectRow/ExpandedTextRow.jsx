import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LinkToggle from "components/lti/LinkToggle";
import { useSelection } from "contexts";
import * as Styled from "./styles";

export default function ExpandedTextRow({ text, trail }) {
  const { t } = useTranslation();
  const { add, remove, has } = useSelection();
  const [hovered, setHovered] = useState(false);
  const item = { type: "text", id: text.id, title: text.label };
  const selected = has(item);

  return (
    <Styled.ExpandedChildRow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Link to={`/lti/texts/${text.id}`} state={{ trail }}>
        {text.label}
      </Link>
      <LinkToggle
        selected={selected}
        onToggle={() => (selected ? remove(item) : add(item))}
        hiddenIfUnlinked={!hovered}
        srLabel={
          selected
            ? t("lti.toggle.remove_item", { title: text.label })
            : t("lti.toggle.add_item", { title: text.label })
        }
      />
    </Styled.ExpandedChildRow>
  );
}
