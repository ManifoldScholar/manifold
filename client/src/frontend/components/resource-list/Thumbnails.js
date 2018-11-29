import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Resourceish from "frontend/components/resourceish";
import lh from "helpers/linkHandler";

export default class ResourceListThumbnails extends Component {
  static displayName = "ResourceList.Thumbnails";

  static propTypes = {
    project: PropTypes.object.isRequired,
    resources: PropTypes.array
  };

  render() {
    if (!this.props.resources) return null;
    return (
      <nav className="resource-thumbnail-list">
        <ul>
          {this.props.resources.map(resource => {
            return (
              <li key={resource.id}>
                <Link
                  to={lh.link(
                    "frontendProjectResource",
                    this.props.project.attributes.slug,
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
      </nav>
    );
  }
}
