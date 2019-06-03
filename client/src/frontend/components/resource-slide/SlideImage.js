import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePreview from "frontend/components/resource-preview";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceListSlideFigureImage extends Component {
  static propTypes = {
    resource: PropTypes.object,
    enableZoom: PropTypes.bool
  };

  static defaultProps = {
    enableZoom: true
  };

  render() {
    const attr = this.props.resource.attributes;
    return (
      <figure>
        {this.props.enableZoom ? (
          <ResourcePreview resource={this.props.resource}>
            <div className="zoom-indicator">
              <span className="zoom-indicator__text">Zoom</span>
              <IconComposer
                icon="zoomIn16"
                size={21.333}
                iconClass="zoom-indicator__icon"
              />
            </div>
          </ResourcePreview>
        ) : null}
        <div
          className="figure-image"
          ref={c => {
            this._figure = c;
          }}
          style={{
            backgroundImage: "url(" + attr.attachmentStyles.medium + ")"
          }}
        />
      </figure>
    );
  }
}
