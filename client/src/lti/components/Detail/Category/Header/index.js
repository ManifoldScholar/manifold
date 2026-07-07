import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { ICON_MAP } from "lti/components/Cart/Group";
import * as Styled from "./styles";

export default function CategoryHeader({ type }) {
  const { t } = useTranslation();
  const icon = ICON_MAP[type];

  if (!icon) return null;

  return (
    <Styled.Header>
      <Styled.IconBlock>
        <IconComposer icon={icon} size={28} />
      </Styled.IconBlock>
      <Styled.LabelBlock>
        <Styled.Label>{t(`lti.types_plural.${type}`)}</Styled.Label>
      </Styled.LabelBlock>
    </Styled.Header>
  );
}
