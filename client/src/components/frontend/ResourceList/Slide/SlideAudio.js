import React, { Component } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/frontend";

export default class ResourceListSlideFigureAudio extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    return (
      <figure>
        <Resource.Player.Audio resource={resource} />
      </figure>
    );
  }
}
