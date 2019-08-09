import React, { Component } from "react";
import { childRoutes } from "helpers/router";

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
    return <React.Fragment>{this.renderRoutes()}</React.Fragment>;
  }
}
