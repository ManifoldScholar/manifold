import React, { Component } from "react";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/authorize";
import lh from "helpers/linkHandler";

export default class ReadingGroups extends Component {
  renderRoutes() {
    const { route, settings, dispatch, fetchData } = this.props;

    return childRoutes(route, {
      childProps: {
        settings,
        dispatch,
        fetchData
      }
    });
  }

  render() {
    return (
      <Authorize
        kind="any"
        failureRedirect={lh.link("frontend")}
        failureNotification
      >
        {this.renderRoutes()}
      </Authorize>
    );
  }
}
