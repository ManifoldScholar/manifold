import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";

export default class ResourceListSlideFigureAudio extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    return (
      <figure>
        <ResourcePlayer.Audio resource={resource} />
      </figure>
    );
  }
}
