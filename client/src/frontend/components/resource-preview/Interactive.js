import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";

export default class ResourcePreviewInteractive extends Component {
  static displayName = "Resource.Preview.Interactive";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="resource-preview resource-preview-interactive">
        <ResourcePlayer.Iframe {...this.props} noPlaceholder />
      </div>
    );
  }
}
