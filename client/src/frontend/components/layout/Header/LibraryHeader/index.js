import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { requests } from "api";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/PressLogo";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import HeaderLogo from "global/components/atomic/HeaderLogo";
import Breadcrumbs, {
  BreadcrumbsContext
} from "global/components/atomic/Breadcrumbs";
import ProjectsToggle from "global/components/navigation/projects-dropdown/Toggle";
import ProjectsDropdown from "global/components/navigation/projects-dropdown";
import { useFromStore } from "hooks";

export default function LibraryHeader() {
  const { t } = useTranslation();
  const { breadcrumbs } = useContext(BreadcrumbsContext);

  const authentication = useFromStore({ path: "authentication" });
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });
  const pages = useFromStore({
    requestKey: requests.gPages,
    action: "select"
  });

  const pageToLinkAttrs = page => ({
    label: page.attributes.navTitle || page.attributes.title,
    newTab: page.attributes.openInNewTab,
    externalUrl: page.attributes.isExternalLink
      ? page.attributes.externalLink
      : null,
    route: !page.attributes.isExternalLink ? "frontendPage" : null,
    matchType: "link",
    args: [page.attributes.slug]
  });
  const links = () => {
    const routes = navigation.frontend(authentication, settings);

    const projectsLink = routes.find(l => l.route === "frontendProjects");

    if (settings.attributes.calculated?.hasProjectCollections) {
      projectsLink.dropdownContent = (
        <ProjectsDropdown links={projectsLink.children} />
      );
      projectsLink.toggle = ProjectsToggle;
    } else {
      projectsLink.dropdown = false;
    }

    const routesWithDropdown = routes.filter(
      l => l.route !== "frontendProjects" && l.route !== "frontendProjectsAll"
    );
    routesWithDropdown.splice(1, 0, projectsLink);

    if (!pages) {
      return routesWithDropdown;
    }

    const pageLinks = pages
      .filter(page => page.attributes.showInHeader)
      .map(pageToLinkAttrs);
    return [...routesWithDropdown, ...pageLinks];
  };

  const { libraryDisabled, homeRedirectUrl } = settings.attributes.general;
  const logoProps =
    libraryDisabled && homeRedirectUrl
      ? { as: "a", href: homeRedirectUrl }
      : { as: "Link", to: lh.link("frontend") };
  const logoUrl = settings.attributes.pressLogoStyles.medium;
  const mobileLogoUrl =
    settings.attributes.pressLogoMobileStyles.small ?? logoUrl;

  const offset = settings.attributes.theme.headerOffset;
  const navStyle = offset
    ? { position: "relative", top: parseInt(offset, 10) }
    : {};

  return (
    <header>
      <div className="library-header library-header--light">
        <SetCSSProperty
          measurement="height"
          propertyName="--library-header-height"
        >
          <div className="library-header__inner">
            <HeaderLogo {...logoProps}>
              <>
                <span className="screen-reader-text">
                  {t("navigation.return_home")}
                </span>
                <PressLogo
                  url={logoUrl}
                  mobileUrl={mobileLogoUrl}
                  styles={settings.attributes.theme.logoStyles}
                  aria-hidden="true"
                />
              </>
            </HeaderLogo>
            <Navigation.Primary
              desktopStyle={navStyle}
              links={links()}
              mode="frontend"
            />
          </div>
        </SetCSSProperty>
      </div>
      <div className="header-border" />
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
    </header>
  );
}

LibraryHeader.displayName = "Layout.LibraryHeader";
