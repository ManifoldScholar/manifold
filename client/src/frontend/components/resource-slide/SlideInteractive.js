import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";

export default class ResourceListSlideInteractive extends Component {
  static defaultProps = {
    enableZoom: true,
    zoomLabel: "View Interactive Resource",
    noPlaceholder: false
  };

  static propTypes = {
    resource: PropTypes.object,
    enableZoom: PropTypes.bool,
    noPlaceholder: PropTypes.bool
  };

  render() {
    return <ResourcePlayer.Iframe {...this.props} />;
  }
}
