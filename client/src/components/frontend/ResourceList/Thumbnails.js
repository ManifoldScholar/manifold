import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Resourceish } from "components/frontend";
import lh from "helpers/linkHandler";

export default class ResourceListThumbnails extends Component {
  static displayName = "ResourceList.Thumbnails";

  static propTypes = {
    projectId: PropTypes.string,
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
                    this.props.projectId,
                    resource.id
                  )}
                  className="resource-link"
                >
                  <Resourceish.Thumbnail
                    key={resource.id}
                    projectId={this.props.projectId}
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
