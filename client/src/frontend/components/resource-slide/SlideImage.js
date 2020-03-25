import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePreview from "frontend/components/resource-preview";
import IconComposer from "global/components/utility/IconComposer";
import Zoom from "./Zoom";

export default class ResourceListSlideFigureImage extends Component {
  static propTypes = {
    resource: PropTypes.object.isRequired
  };


  render() {
    const attr = this.props.resource.attributes;
    return (
      <figure>
        <Zoom resource={this.props.resource} />
        <div
          className="figure-image"
          style={{
            backgroundImage: "url(" + attr.attachmentStyles.medium + ")"
          }}
        />
      </figure>
    );
  }
}
