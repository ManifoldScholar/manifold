import React, { Component } from "react";
import { Resource } from "components/frontend";
import PropTypes from "prop-types";

export default class ResourcePreviewVideo extends Component {
  static displayName = "Resource.Preview.Video";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    const resource = this.props.resource;

    return (
      <div className="resource-preview resource-preview-video">
        <Resource.Player.Video resource={resource} />
      </div>
    );
  }
}
