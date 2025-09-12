import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Header({ onClose }) {
  const { t } = useTranslation();

  return (
    <Styled.Header>
      <Styled.CloseButton onClick={onClose}>
        <Styled.CloseText className="overlay-close__text">
          {t("actions.close")}
        </Styled.CloseText>
        <IconComposer icon="close16" size={14} />
      </Styled.CloseButton>
    </Styled.Header>
  );
}
