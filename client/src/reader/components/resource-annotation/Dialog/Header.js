import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Header({ textTitle, onClose }) {
  const { t } = useTranslation();

  return (
    <Styled.Header>
      <Styled.HeaderButton onClick={onClose}>
        <IconComposer icon="arrowLeft16" size={14} />
        <span className="overlay-close__text">Back to {textTitle}</span>
      </Styled.HeaderButton>
      <Styled.CloseButton onClick={onClose}>
        <Styled.CloseText className="overlay-close__text">
          {t("actions.close")}
        </Styled.CloseText>
        <IconComposer icon="close16" size={14} />
      </Styled.CloseButton>
    </Styled.Header>
  );
}
