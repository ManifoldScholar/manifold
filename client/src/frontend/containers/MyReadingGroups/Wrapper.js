import React, { Component } from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";

export default class MyReadingGroupsContainer extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired
  };

  render() {
    return (
      <Authorize
        kind="any"
        failureRedirect={lh.link("frontendLogin")}
        failureNotification
      >
        {childRoutes(this.props.route)}
      </Authorize>
    );
  }
}
