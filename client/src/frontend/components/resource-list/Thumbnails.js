import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Resourceish from "frontend/components/resourceish";
import lh from "helpers/linkHandler";

export default class ResourceListThumbnails extends Component {
  static displayName = "ResourceList.Thumbnails";

  static propTypes = {
    resources: PropTypes.array
  };

  render() {
    if (!this.props.resources?.length > 0) return null;
    return (
      <div className="resource-thumbnail-list">
        <ul>
          {this.props.resources.map(resource => {
            const { projectSlug } = resource.attributes;
            return (
              <li key={resource.id}>
                <Link
                  to={lh.link(
                    "frontendProjectResource",
                    projectSlug,
                    resource.attributes.slug
                  )}
                  className="resource-link"
                >
                  <Resourceish.Thumbnail
                    key={resource.id}
                    resourceish={resource}
                    showTitle
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
