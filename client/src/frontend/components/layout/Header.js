import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Navigation from "global/components/navigation";
import HeaderNotifications from "global/components/HeaderNotifications";
import PressLogo from "global/components/PressLogo";
import { Link } from "react-router-dom";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import PreHeader from "./PreHeader";
import BodyClass from "hoc/body-class";
import BlurOnLocationChange from "hoc/blur-on-location-change";
import Utility from "global/components/utility";

export default class LayoutHeader extends PureComponent {
  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object,
    settings: PropTypes.object,
    pages: PropTypes.array
  };

  static defaultProps = {
    pages: []
  };

  get bodyClasses() {
    return classNames({
      standalone: this.standaloneMode,
      "header-tall": get(
        this.props.settings,
        "attributes.pressLogoStyles.small"
      )
    });
  }

  get headerClasses() {
    return classNames({
      "header-app": true,
      "header-app--default": true
    });
  }

  get containerClasses() {
    return classNames({
      "header-container": true,
      "header-container--default": true
    });
  }

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

  frontendLinks(props) {
    const out = navigation.frontend(this.props.authentication);
    const pages = props.pages || [];
    const pageLinks = pages.reduce((list, page) => {
      const item = this.pageItem(page);
      if (item) list.push(item);

      return list;
    }, []);

    return out.concat(pageLinks);
  }

  render() {
    const links = this.frontendLinks(this.props);
    const offset = get(this.props, "settings.attributes.theme.headerOffset");
    const navStyle = offset
      ? { position: "relative", top: parseInt(offset, 10) }
      : {};
    const logoUrl = get(
      this.props.settings,
      "attributes.pressLogoStyles.small"
    );
    const mobileLogoUrl =
      get(this.props.settings, "attributes.pressLogoMobileStyles.small") ||
      logoUrl;

    return (
      <BlurOnLocationChange location={this.props.location}>
        <BodyClass className={this.bodyClasses}>
          <header className={this.headerClasses}>
            <Utility.SkipLink />
            <PreHeader />
            <div className={this.containerClasses}>
              <Link to={lh.link("frontend")} className="header-logo">
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
              </Link>
              <Navigation.Primary
                desktopStyle={navStyle}
                links={links}
                commonActions={this.props.commonActions}
                authentication={this.props.authentication}
                visibility={this.props.visibility}
                mode="frontend"
                standaloneMode={this.standaloneMode}
                darkMode={this.darkMode}
              />
            </div>

            <div className="header-border" />
            <HeaderNotifications scope="global" />
          </header>
        </BodyClass>
      </BlurOnLocationChange>
    );
  }
}
