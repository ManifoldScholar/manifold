import React, { Component } from "react";
import { Resource } from "components/frontend";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourcePreviewVideo extends Component {
  static displayName = "Resource.Preview.Video";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    const resource = this.props.resource;
    const videoClasses = classnames({
      "resource-preview": true,
      "resource-preview-video": true,
      "external-video": resource.attributes.subKind === "external_video"
    });

    return (
      <div className={videoClasses}>
        <Resource.Player.Video resource={resource} />
      </div>
    );
  }
}
