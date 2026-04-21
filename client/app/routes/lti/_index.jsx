import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Button from "components/global/atomic/Button";
import SearchForm from "components/lti/SearchForm";
import * as Styled from "./styles";

export default function LtiLanding() {
  const { t } = useTranslation();

  return (
    <Styled.Landing>
      <h1>{t("lti.landing.title")}</h1>
      <Styled.LandingSearch>
        <SearchForm size="md" placeholder={t("lti.landing.placeholder")} />
      </Styled.LandingSearch>
      <Styled.BrowseButtons>
        <Button
          as={Link}
          to="/lti/projects"
          size="md"
          background="outline"
          label={t("lti.landing.browse_projects")}
        />
        <Button
          as={Link}
          to="/lti/texts"
          size="md"
          background="outline"
          label={t("lti.landing.browse_texts")}
        />
      </Styled.BrowseButtons>
    </Styled.Landing>
  );
}
