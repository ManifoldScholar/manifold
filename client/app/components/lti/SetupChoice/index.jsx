import { useTranslation } from "react-i18next";
import Button from "components/global/atomic/Button";
import * as Styled from "./styles";

export default function SetupChoice({ onChoose }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <h1>{t("lti.setup.title")}</h1>
      <Styled.Description>{t("lti.setup.description")}</Styled.Description>
      <Styled.Actions>
        <Button
          size="md"
          background="accent"
          label={t("lti.setup.create_reading_group")}
          onClick={() => onChoose(true)}
        />
        <Button
          size="md"
          background="accent"
          label={t("lti.setup.links_only")}
          onClick={() => onChoose(false)}
        />
      </Styled.Actions>
    </Styled.Wrapper>
  );
}
