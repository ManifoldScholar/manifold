import { useTranslation, Trans } from "react-i18next";
import SearchQuery from "components/global/search/query";
import IconComposer from "components/global/utility/IconComposer";
import { useDeepLinking } from "contexts";
import { PRIMARY_FACETS } from "../filters";
import * as Styled from "./styles";

export default function LtiIndexRoute() {
  const { t } = useTranslation();
  const { acceptMultiple } = useDeepLinking();

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
        <Trans
          i18nKey={
            acceptMultiple
              ? "lti.landing.message_body"
              : "lti.landing.message_body_single"
          }
          components={[<p />]}
        />
      </Styled.Message>
    </Styled.Landing>
  );
}
