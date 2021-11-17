import React, { Component } from "react";
import PropTypes from "prop-types";
import Navigation from "global/components/navigation";
import PressLogo from "global/components/PressLogo";
import HeaderNotifications from "global/components/HeaderNotifications";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Utility from "global/components/utility";
import HeaderLogo from "global/components/atomic/HeaderLogo";

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
      <BlurOnLocationChange
        tag="header"
        className="header-app header-app--sticky"
        location={this.props.location}
      >
        <Utility.SetCSSProperty
          measurement="height"
          propertyName="--library-header-height"
        >
          <Utility.SkipLink />
          <div className="library-header library-header--dark">
            <div className="library-header__inner">
              <HeaderLogo as="Link" to={lh.link("backend")}>
                <span className="screen-reader-text">Return to home</span>
                <PressLogo aria-hidden="true" />
              </HeaderLogo>
              <Navigation.Primary
                links={links}
                commonActions={this.props.commonActions}
                authentication={this.props.authentication}
                visibility={this.props.visibility}
                mode="backend"
                darkTheme
              />
            </div>
          </div>
          <div className="header-border" />
        </Utility.SetCSSProperty>
        <HeaderNotifications scope="global" />
      </BlurOnLocationChange>
    );
  }
}
