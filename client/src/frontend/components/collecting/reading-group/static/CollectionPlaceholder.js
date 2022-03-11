import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function CollectionPlaceholder() {
  const { t } = useTranslation();

  return (
    <section className="collection-placeholder">
      <div className="collection-placeholder__inner">
        <Trans
          i18nKey="placeholders.reading_group.customize"
          components={[
            <h3 className="collection-placeholder__heading" />,
            <p />,
            <h3 className="collection-placeholder__heading" />,
            <p />
          ]}
        />
        <div className="collection-placeholder__actions">
          <Link to={lh.link("frontendProjects")} className="button-tertiary">
            {t("navigation.browse_library")}
          </Link>
          <a href="#search" className="button-tertiary">
            {t("navigation.search_by_keyword")}
          </a>
        </div>
        <Trans
          i18nKey="placeholders.reading_group.settings"
          components={[
            <h3 className="collection-placeholder__heading" />,
            <p />
          ]}
        />
        <div className="collection-placeholder__actions">
          <a href="#settings" className="button-tertiary">
            {t("actions.edit_reading_group")}
          </a>
        </div>
      </div>
    </section>
  );
}

CollectionPlaceholder.displayName =
  "Collecting.ReadingGroup.CollectionPlaceholder";

export default CollectionPlaceholder;
