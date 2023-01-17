import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";

export default function ProjectsWrapper({ route }) {
  const { t } = useTranslation();
  const secondaryLinks = navigation.projects();

  return (
    <Authorize
      ability="update"
      entity={["project"]}
      failureFatalError={{
        body: t("projects.unauthorized")
      }}
    >
      <div>
        <RedirectToFirstMatch
          from={lh.link("backendProjects")}
          candidates={secondaryLinks}
        />
        <Navigation.Secondary links={secondaryLinks} />
        <main id="skip-to-main" tabIndex={-1} className="backend-detail">
          {childRoutes(route)}
        </main>
      </div>
    </Authorize>
  );
}

ProjectsWrapper.propTypes = {
  route: PropTypes.object
};
