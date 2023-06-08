import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/PressLogo";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import HeaderLogo from "global/components/atomic/HeaderLogo";
import Breadcrumbs, {
  BreadcrumbsContext
} from "global/components/atomic/Breadcrumbs";
import { useShowJournalsActive } from "hooks";

export default function LibraryHeader({
  settings,
  authentication,
  pages,
  visibility,
  commonActions
}) {
  const { t } = useTranslation();
  const { breadcrumbs } = useContext(BreadcrumbsContext);

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
    if (!pages) {
      return routes;
    }
    const pageLinks = pages
      .filter(page => page.attributes.showInHeader)
      .map(pageToLinkAttrs);
    return [...routes, ...pageLinks];
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

  const journalIsActive = useShowJournalsActive();

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
              commonActions={commonActions}
              authentication={authentication}
              visibility={visibility}
              mode="frontend"
              journalIsActive={journalIsActive}
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

LibraryHeader.propTypes = {
  settings: PropTypes.object,
  authentication: PropTypes.object,
  pages: PropTypes.arrayOf(PropTypes.object),
  visibility: PropTypes.object,
  commonActions: PropTypes.object
};
