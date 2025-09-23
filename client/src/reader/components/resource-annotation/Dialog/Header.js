import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Header({ title, headingId, onClose }) {
  const { t } = useTranslation();

  return (
    <Styled.Header>
      {title && (
        <h2 id={headingId} className="screen-reader-text">
          {title}
        </h2>
      )}
      <Styled.CloseButton onClick={onClose}>
        <Styled.CloseText className="overlay-close__text">
          {t("actions.close")}
        </Styled.CloseText>
        <IconComposer icon="close16" size={14} />
      </Styled.CloseButton>
    </Styled.Header>
  );
}
