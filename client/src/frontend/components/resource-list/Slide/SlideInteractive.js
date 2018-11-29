import React, { Component } from "react";
import PropTypes from "prop-types";
import Resource from "frontend/components/resource";

export default class ResourceListSlideInteractive extends Component {
  static propTypes = {
    resource: PropTypes.object,
    enableZoom: PropTypes.bool,
    noPlaceholder: PropTypes.bool
  };

  static defaultProps = {
    enableZoom: true,
    zoomLabel: "View Interactive Resource",
    noPlaceholder: false
  };

  render() {
    return <Resource.Player.Iframe {...this.props} />;
  }
}
