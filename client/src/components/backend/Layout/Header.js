import React, { Component } from "react";
import PropTypes from "prop-types";
import HigherOrder from "containers/global/HigherOrder";
import { Link } from "react-router-dom";
import { HeaderNotifications, PressLogo, Navigation } from "components/global";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";

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
      <HigherOrder.BlurOnLocationChange location={this.props.location}>
        <header className={"header-app dark"}>
          <div className="header-container">
            <Link to={lh.link("frontend")} className="logo">
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
      </HigherOrder.BlurOnLocationChange>
    );
  }
}
