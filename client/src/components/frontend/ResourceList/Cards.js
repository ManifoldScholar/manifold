import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { Resource, Utility } from 'components/frontend';

export default class ResourceListCards extends PureComponent {

  static displayName = "ResourceList.Cards";

  static propTypes = {
    projectId: PropTypes.string,
    resources: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  constructor() {
    super();
  }

  render() {
    if (!this.props.resources) return null;

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
            {this.props.resources.map((resourceLike) => {
              let resource;
              if (resourceLike.type === "collectionResources") {
                resource = resourceLike.relationships.resource;
              } else {
                resource = resourceLike;
              }
              return (
                <Resource.Card
                  key={resource.id}
                  resource={resource}
                  projectId={this.props.projectId}
                />
              );
            })}
          </ul>
          {
            this.props.pagination ?
              <Utility.Pagination
                paginationClickHandler={this.props.paginationClickHandler}
                pagination={this.props.pagination}
              />
              : null
          }
        </nav>
      </div>
    );
  }
}
