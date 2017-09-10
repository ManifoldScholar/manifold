import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ResourcePreviewImage extends Component {
  static displayName = "Resource.Preview.Image";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    const resource = this.props.resource;
    const resourceImage = resource.attributes.attachmentStyles.original;
    if (!resourceImage) return null;

    return (
      <div className="resource-preview resource-preview-image">
        <img src={resourceImage} alt={resource.attributes.title} />
      </div>
    );
  }
}
