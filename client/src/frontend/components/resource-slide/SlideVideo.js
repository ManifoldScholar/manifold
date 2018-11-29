import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";

export default class ResourceListSlideFigureVideo extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    return (
      <figure>
        <ResourcePlayer.Video resource={resource} />
      </figure>
    );
  }
}
