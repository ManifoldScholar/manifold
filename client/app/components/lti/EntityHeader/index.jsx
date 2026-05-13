import { useTranslation } from "react-i18next";
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
      </Styled.HeaderRow>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}
    </>
  );
}
