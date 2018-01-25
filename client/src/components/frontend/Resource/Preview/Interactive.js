import React, { Component } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/frontend";

export default class ResourcePreviewInteractive extends Component {
  static displayName = "Resource.Preview.Interactive";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="resource-preview resource-preview-interactive">
        <Resource.Player.Iframe {...this.props} noPlaceholder />
      </div>
    );
  }
}
