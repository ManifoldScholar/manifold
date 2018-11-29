import React, { Component } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/frontend";

export default class ResourceListSlideFigureVideo extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    return (
      <figure>
        <Resource.Player.Video resource={resource} />
      </figure>
    );
  }
}
