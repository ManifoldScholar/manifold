import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Resource, Utility } from 'components/frontend';

export default class ResourceListCards extends Component {

  static displayName = "ResourceList.Cards";

  static propTypes = {
    projectId: PropTypes.string,
    resources: PropTypes.array
  };

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <nav className="resource-list">
          <div className="resource-count">
            <span>
              {this.props.resources.length.toLocaleString()}
            </span>
              {' Resources Shown'}
          </div>
          <ul>
            {this.props.resources.map((resource) => {
              return (
                <Resource.Card
                  key={resource.id}
                  resource={resource}
                  projectId={this.props.projectId}
                />
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
}
