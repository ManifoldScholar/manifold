import React, { Component } from "react";
import PropTypes from "prop-types";
import Zoom from "./Zoom";

export default class ResourceListSlideImage extends Component {
  static displayName = "ResourceList.Slide.Image";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    enableZoom: PropTypes.bool
  };

  static defaultProps = {
    enableZoom: true
  };

  get background() {
    const { resource } = this.props;
    if (!resource.attributes.attachmentStyles) return null;
    return resource.attributes.attachmentStyles.medium;
  }

  render() {
    return (
      <>
        {this.props.enableZoom && <Zoom resource={this.props.resource} />}
        <div
          className="figure-image"
          style={{
            backgroundImage: `url(${this.background})`
          }}
        />
      </>
    );
  }
}
