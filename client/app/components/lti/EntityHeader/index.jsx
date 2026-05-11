import { useTranslation } from "react-i18next";
import LinkToggle from "components/lti/LinkToggle";
import { useSelection } from "contexts";
import * as Styled from "./styles";

export default function EntityHeader({ id, type, title, subtitle }) {
  const { t } = useTranslation();
  const { add, remove, has } = useSelection();

  const selectionItem = { type, id, title };
  const selected = has(selectionItem);

  return (
    <>
      <Styled.HeaderRow>
        <h1>{title}</h1>
        <LinkToggle
          selected={selected}
          onToggle={() =>
            selected ? remove(selectionItem) : add(selectionItem)
          }
          srLabel={
            selected
              ? t("lti.toggle.remove_item", { title })
              : t("lti.toggle.add_item", { title })
          }
        />
      </Styled.HeaderRow>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}
    </>
  );
}
