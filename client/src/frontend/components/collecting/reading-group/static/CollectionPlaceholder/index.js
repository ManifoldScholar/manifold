import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

function CollectionPlaceholder() {
  const { t } = useTranslation();

  return (
    <Styled.Placeholder>
      <Styled.Inner>
        <Trans
          i18nKey="placeholders.reading_group.customize"
          components={[<Styled.Heading />, <p />, <Styled.Heading />, <p />]}
        />
        <Styled.Actions>
          <Link to={lh.link("frontendProjects")} className="button-tertiary">
            {t("navigation.browse_library")}
          </Link>
          <a href="#search" className="button-tertiary">
            {t("navigation.search_by_keyword")}
          </a>
        </Styled.Actions>
        <Trans
          i18nKey="placeholders.reading_group.settings"
          components={[<Styled.Heading />, <p />]}
        />
        <Styled.Actions>
          <a href="#settings" className="button-tertiary">
            {t("actions.edit_reading_group")}
          </a>
        </Styled.Actions>
      </Styled.Inner>
    </Styled.Placeholder>
  );
}

CollectionPlaceholder.displayName =
  "Collecting.ReadingGroup.CollectionPlaceholder";

export default CollectionPlaceholder;
