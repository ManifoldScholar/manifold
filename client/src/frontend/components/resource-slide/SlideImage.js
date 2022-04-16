import React, { Component } from "react";
import PropTypes from "prop-types";
import Zoom from "./Zoom";
import * as Styled from "./styles";

export default class ResourceListSlideImage extends Component {
  static displayName = "ResourceList.Slide.Image";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    enableZoom: PropTypes.bool
  };

  static defaultProps = {
    enableZoom: true
  };

  get image() {
    return this.props.resource.attributes;
  }

  get src() {
    return this.image.attachmentStyles?.medium;
  }

  get altText() {
    return this.image.altText;
  }

  render() {
    return (
      <>
        {this.props.enableZoom && <Zoom resource={this.props.resource} />}
        <Styled.Image src={this.src} alt={this.altText} />
      </>
    );
  }
}
