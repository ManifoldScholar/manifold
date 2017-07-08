import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Resource } from "components/frontend";

export default class ResourceViewerGroupThumbnail extends PureComponent {
  static displayName = "ResourceViewer.GroupThumbnail";

  static propTypes = {
    resource: PropTypes.object,
    active: PropTypes.bool
  };

  render() {
    const resource = this.props.resource;
    const variant = "smallPortrait";
    const thumbnailClass = classNames({
      "group-thumbnail": true,
      highlighted: this.props.active
    });

    return (
      <div className={thumbnailClass}>
        <Resource.Thumbnail
          resource={resource}
          showTitle={false}
          showKind={false}
          variant={variant}
          additionalClasses="minimal preview"
        />
      </div>
    );
  }
}
