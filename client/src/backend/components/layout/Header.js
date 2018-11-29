import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/press-logo";
import HeaderNotifications from "global/components/header-notifications";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";

import BlurOnLocationChange from "hoc/blur-on-location-change";

export default class LayoutHeader extends Component {
  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    authentication: PropTypes.object,
    commonActions: PropTypes.object
  };

  render() {
    const links = navigation.backend();

    return (
      <BlurOnLocationChange location={this.props.location}>
        <header className={"header-app dark"}>
          <div className="header-container">
            <Link to={lh.link("frontend")} className="header-logo">
              <span className="screen-reader-text">Return to home</span>
              <PressLogo aria-hidden="true" />
            </Link>

            <Navigation.Primary
              links={links}
              commonActions={this.props.commonActions}
              authentication={this.props.authentication}
              visibility={this.props.visibility}
              mode="backend"
            />
          </div>

          <div className="header-border" />
          <HeaderNotifications scope="global" />
        </header>
      </BlurOnLocationChange>
    );
  }
}
