import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePreview from "frontend/components/resource-preview";

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
              Zoom
              <i className="manicon manicon-magnify-plus" aria-hidden="true" />
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
