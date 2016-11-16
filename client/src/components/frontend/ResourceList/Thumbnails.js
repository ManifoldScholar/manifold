import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Resource } from 'components/frontend';

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
    return (
      <nav className="resource-thumbnail-list">
        <ul>
          {this.props.resources.map((resource) => {
            return (
              <Resource.Thumbnail
                key={resource.id}
                projectId={this.props.projectId}
                resource={resource}
              />
            );
          })}
        </ul>
      </nav>
    );
  }
}
