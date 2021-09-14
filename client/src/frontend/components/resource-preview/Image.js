import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ResourcePreviewImage extends Component {
  static displayName = "Resource.Preview.Image";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  get image() {
    return this.props.resource.attributes;
  }

  get src() {
    return this.image.attachmentStyles?.original;
  }

  get altText() {
    return this.image.altText;
  }

  render() {
    if (!this.image || !this.src) return null;

    return (
      <div className="resource-preview resource-preview-image">
        <img src={this.src} alt={this.altText} />
      </div>
    );
  }
}
