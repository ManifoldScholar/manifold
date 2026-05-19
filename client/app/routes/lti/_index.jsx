import { useTranslation, Trans } from "react-i18next";
import SearchQuery from "components/global/search/query";
import IconComposer from "components/global/utility/IconComposer";
import * as Styled from "./styles";

export default function LtiLanding() {
  const { t } = useTranslation();

  return (
    <Styled.Landing>
      <IconComposer icon="DeepLinkingLogoUnique" size={100} />
      <Styled.Title>{t("lti.landing.title")}</Styled.Title>
      <Styled.Subtitle>{t("lti.landing.subtitle")}</Styled.Subtitle>
      <Styled.Search>
        <SearchQuery.Provider>
          <SearchQuery.Form
            action="/lti/search"
            placeholder={t("lti.landing.placeholder")}
          />
        </SearchQuery.Provider>
      </Styled.Search>
      <Styled.Message title={t("lti.landing.message_heading")}>
        <Trans i18nKey="lti.landing.message_body" components={[<p />]} />
      </Styled.Message>
    </Styled.Landing>
  );
}
