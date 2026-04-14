import Navigation from "components/global/navigation";
import PressLogo from "components/global/PressLogo";
import HeaderNotifications from "components/global/HeaderNotifications";

import navigation from "helpers/router/navigation";
import Utility from "components/global/utility";
import HeaderLogo from "components/global/atomic/HeaderLogo";
import { useTranslation } from "react-i18next";
import ProjectsToggle from "components/global/navigation/projects-dropdown/Toggle";
import ProjectsDropdown from "components/global/navigation/projects-dropdown";
import Authorization from "helpers/authorization";
import { useAuthentication } from "hooks";

export default function LayoutHeader() {
  const { t } = useTranslation();
  const authentication = useAuthentication();

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
    const projectsLink = baseLinks.find(l => l.path === "/backend/projects");
    projectsLink.dropdownContent = (
      <ProjectsDropdown links={projectsLink?.children} />
    );
    projectsLink.toggle = ProjectsToggle;
    links = baseLinks.filter(l => l.path !== "/backend/projects");
    links.splice(1, 0, projectsLink);
  } else {
    links = baseLinks.filter(l => l.path !== "/backend/projects");
  }

  return (
    <header className="header-app header-app--sticky">
      <Utility.SetCSSProperty
        measurement="height"
        propertyName="--library-header-height"
      >
        <div className="library-header library-header--dark">
          <div className="library-header__inner">
            <HeaderLogo as="Link" to="/backend">
              <span className="screen-reader-text">
                {t("navigation.return_home")}
              </span>
              <PressLogo aria-hidden="true" />
            </HeaderLogo>
            <Navigation.Primary
              links={hasAnyAdminAccess ? links : []}
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
