import React from "react";
import PropTypes from "prop-types";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/PressLogo";
import HeaderNotifications from "global/components/HeaderNotifications";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Utility from "global/components/utility";
import HeaderLogo from "global/components/atomic/HeaderLogo";
import { useTranslation } from "react-i18next";
import ProjectsToggle from "global/components/navigation/projects-dropdown/Toggle";
import ProjectsDropdown from "global/components/navigation/projects-dropdown";
import Authorization from "helpers/authorization";
import { useShowJournalsActive } from "hooks";

export default function LayoutHeader({
  commonActions,
  authentication,
  visibility
}) {
  const { t } = useTranslation();
  const journalIsActive = useShowJournalsActive();

  const authorization = new Authorization();
  const canUpdateProjectCollections = authorization.authorizeAbility({
    authentication,
    entity: "projectCollection",
    ability: "update"
  });

  const hasAnyAdminAccess = authorization.authorizeKind({
    authentication,
    kind: [
      "admin",
      "editor",
      "marketeer",
      "project_creator",
      "project_editor",
      "project_property_manager",
      "journal_editor"
    ]
  });

  const baseLinks = navigation.backend();

  let links;

  if (canUpdateProjectCollections) {
    const projectsLink = baseLinks.find(l => l.route === "backendProjects");
    projectsLink.dropdownContent = (
      <ProjectsDropdown links={projectsLink.children} />
    );
    projectsLink.toggle = ProjectsToggle;
    links = baseLinks.filter(
      l => l.route !== "backendProjects" && l.route !== "backendProjectsAll"
    );
    links.splice(1, 0, projectsLink);
  } else {
    links = baseLinks.filter(l => l.route !== "backendProjects");
  }

  return (
    <header className="header-app header-app--sticky">
      <Utility.SetCSSProperty
        measurement="height"
        propertyName="--library-header-height"
      >
        <div className="library-header library-header--dark">
          <div className="library-header__inner">
            <HeaderLogo as="Link" to={lh.link("backend")}>
              <span className="screen-reader-text">
                {t("navigation.return_home")}
              </span>
              <PressLogo aria-hidden="true" />
            </HeaderLogo>
            <Navigation.Primary
              links={hasAnyAdminAccess ? links : []}
              journalIsActive={journalIsActive}
              commonActions={commonActions}
              authentication={authentication}
              visibility={visibility}
              mode="backend"
              darkTheme
            />
          </div>
        </div>
        <div className="header-border" />
      </Utility.SetCSSProperty>
      <HeaderNotifications scope="global" />
    </header>
  );
}

LayoutHeader.displayName = "Layout.Header";

LayoutHeader.propTypes = {
  visibility: PropTypes.object,
  authentication: PropTypes.object,
  commonActions: PropTypes.object
};
