import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Resource } from 'components/frontend';
import lh from 'helpers/linkHandler';

export default class ResourceListThumbnails extends Component {

  static displayName = "ResourceList.Thumbnails"

  static propTypes = {
    projectId: PropTypes.string,
    resources: PropTypes.array
  };

  constructor() {
    super();
  }

  render() {
    if (!this.props.resources) return null;
    return (
      <nav className="resource-thumbnail-list">
        <ul>
          {this.props.resources.map((resource) => {
            return (
              <li key={resource.id}>
                <Link
                  to={lh.link("frontendProjectResource", this.props.projectId, resource.id)}
                  className="resource-link"
                >
                  <Resource.Thumbnail
                    key={resource.id}
                    projectId={this.props.projectId}
                    resource={resource}
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
