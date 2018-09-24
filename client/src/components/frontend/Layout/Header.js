import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { PressLogo, HeaderNotifications, Navigation } from "components/global";
import { Link } from "react-router-dom";
import get from "lodash/get";
import HigherOrder from "containers/global/HigherOrder";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";

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

  frontendLinks(props) {
    const out = navigation.frontend(this.props.authentication);
    const pages = props.pages || [];
    const pageLinks = pages.reduce((list, page) => {
      if (page.attributes.showInHeader) {
        const item = {
          label: page.attributes.title,
          route: "frontendPage",
          args: [page.id]
        };

        list.push(item);
      }

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
      <HigherOrder.BlurOnLocationChange location={this.props.location}>
        <header className={"header-app"}>
          <div className="header-container">
            <Link to={lh.link("frontend")} className="logo">
              <span className="screen-reader-text">Return to home</span>
              <PressLogo
                url={logoUrl}
                mobileUrl={mobileLogoUrl}
                styles={get(this.props.settings, "attributes.theme.logoStyles")}
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
              exact
            />
          </div>

          <div className="header-border" />
          <HeaderNotifications scope="global" />
        </header>
      </HigherOrder.BlurOnLocationChange>
    );
  }
}
