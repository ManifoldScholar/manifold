import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { childRoutes } from "helpers/router";
import HeadContent from "global/components/HeadContent";

export default function AnalyticsWrapperContainer({ route }) {
  const { t } = useTranslation();

  return (
    <>
      <HeadContent
        title={`${t("titles.analytics")} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <main id="skip-to-main" tabIndex={-1}>
        <h1 className="screen-reader-text">{t("dashboard.title")}</h1>
        <section>
          <div className="container">{childRoutes(route)}</div>
        </section>
      </main>
    </>
  );
}

AnalyticsWrapperContainer.propTypes = {
  route: PropTypes.object
};
