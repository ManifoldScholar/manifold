import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { childRoutes } from "helpers/router";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import { useRedirectToFirstMatch } from "hooks";

export default function ProjectsWrapper({ route }) {
  const { t } = useTranslation();
  const secondaryLinks = navigation.projects();

  useRedirectToFirstMatch({
    route: "backendProjects",
    candidates: secondaryLinks
  });

  return (
    <Authorize
      ability="update"
      entity={["project"]}
      failureNotification={{
        body: t("projects.unauthorized")
      }}
      failureRedirect
    >
      <main id="skip-to-main" tabIndex={-1} className="backend-detail">
        {childRoutes(route)}
      </main>
    </Authorize>
  );
}

ProjectsWrapper.propTypes = {
  route: PropTypes.object
};
