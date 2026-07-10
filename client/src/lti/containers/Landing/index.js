import { useTranslation, Trans } from "react-i18next";
import SearchQuery from "global/components/search/query";
import { PRIMARY_FACETS } from "lti/containers/Search/filters";
import IconComposer from "global/components/utility/IconComposer";
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
            action="/lti/deep_linking/search"
            placeholder={t("lti.landing.placeholder")}
          >
            {PRIMARY_FACETS.map(facet => (
              <input key={facet} type="hidden" name="facets" value={facet} />
            ))}
          </SearchQuery.Form>
        </SearchQuery.Provider>
      </Styled.Search>
      <Styled.Message title={t("lti.landing.message_heading")}>
        <Trans i18nKey="lti.landing.message_body" components={[<p />]} />
      </Styled.Message>
    </Styled.Landing>
  );
}

LtiLanding.displayName = "Lti.LandingContainer";
