import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";

export default class ResourceListSlideAudio extends Component {
  static displayName = "ResourceList.Slide.Audio";

  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    return <ResourcePlayer.Audio resource={resource} />;
  }
}
