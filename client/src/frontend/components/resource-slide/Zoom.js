import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ResourcePreview from "frontend/components/resource-preview";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceListSlideZoom extends PureComponent {
  static displayName = "ResourceList.Slide.Zoom";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    label: PropTypes.string
  };

  static defaultProps = {
    label: "Zoom"
  };

  render() {
    const { resource, label } = this.props;

    return (
      <ResourcePreview resource={resource}>
        <div className="zoom-indicator">
          <span className="zoom-indicator__text">{label}</span>
          <IconComposer
            icon="zoomIn16"
            size={21.333}
            iconClass="zoom-indicator__icon"
          />
        </div>
      </ResourcePreview>
    );
  }
}
