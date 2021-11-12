import React, { PureComponent } from "react";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/PressLogo";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import BackLink from "frontend/components/back-link";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import HeaderLogo from "global/components/atomic/HeaderLogo";

export default class LayoutLibraryHeader extends PureComponent {
  static displayName = "Layout.LibraryHeader";

  static propTypes = {};

  static defaultProps = {
    pages: []
  };

  pageItem(page) {
    if (!page.attributes.showInHeader) return null;
    const attrs = {
      label: page.attributes.navTitle || page.attributes.title,
      newTab: page.attributes.openInNewTab
    };

    if (page.attributes.isExternalLink) {
      attrs.externalUrl = page.attributes.externalLink;
    } else {
      attrs.route = "frontendPage";
      attrs.matchType = "link";
      attrs.args = [page.attributes.slug];
    }

    return attrs;
  }

  get logoRedirectUrl() {
    const { settings } = this.props;
    const { homeRedirectUrl } = settings.attributes.general;
    return homeRedirectUrl;
  }

  get links() {
    const { authentication, settings, pages } = this.props;
    const out = navigation.frontend(authentication, settings);
    const ensurePages = pages || [];
    const pageLinks = ensurePages.reduce((list, page) => {
      const item = this.pageItem(page);
      if (item) list.push(item);

      return list;
    }, []);

    return out.concat(pageLinks);
  }

  get doesLogoRedirect() {
    const { settings } = this.props;
    const { libraryDisabled, homeRedirectUrl } = settings.attributes.general;
    return libraryDisabled && homeRedirectUrl;
  }

  linkLogo(children) {
    if (this.doesLogoRedirect) {
      return (
        <HeaderLogo as="a" href={this.logoRedirectUrl}>
          {children}
        </HeaderLogo>
      );
    }
    return (
      <HeaderLogo as="Link" to={lh.link("frontend")}>
        {children}
      </HeaderLogo>
    );
  }

  render() {
    const offset = get(this.props, "settings.attributes.theme.headerOffset");
    const navStyle = offset
      ? { position: "relative", top: parseInt(offset, 10) }
      : {};
    const logoUrl = get(
      this.props.settings,
      "attributes.pressLogoStyles.medium"
    );
    const mobileLogoUrl =
      get(this.props.settings, "attributes.pressLogoMobileStyles.small") ||
      logoUrl;

    return (
      <>
        <div className="library-header library-header--light">
          <SetCSSProperty
            measurement="height"
            propertyName="--library-header-height"
          >
            <div className="library-header__inner">
              {this.linkLogo(
                <>
                  <span className="screen-reader-text">Return to home</span>
                  <PressLogo
                    url={logoUrl}
                    mobileUrl={mobileLogoUrl}
                    styles={get(
                      this.props.settings,
                      "attributes.theme.logoStyles"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
              <Navigation.Primary
                desktopStyle={navStyle}
                links={this.links}
                commonActions={this.props.commonActions}
                authentication={this.props.authentication}
                visibility={this.props.visibility}
                mode="frontend"
              />
            </div>
          </SetCSSProperty>
        </div>
        <div className="header-border" />
        <BackLink.Render />
      </>
    );
  }
}
