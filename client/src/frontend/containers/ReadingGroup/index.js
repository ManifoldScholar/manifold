import React, { Component } from "react";
import { childRoutes } from "helpers/router";

export default class ReadingGroup extends Component {
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
      <React.Fragment>
        Reading Group Wrapper...
        <br />
        {this.renderRoutes()}
      </React.Fragment>
    );
  }
}
