import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import {
  Utility,
  ResourceList
} from 'components/frontend';

export default class ResourceCollectionDetail extends Component {

  static displayName = "ResourceCollection.Detail";

  static propTypes = {
    resourceCollection: PropTypes.object,
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const collection = this.props.resourceCollection;
    if (!project || !collection) return null;

    const attr = collection.attributes;
    const resources = collection.relationships.resources;
    return (
      <section>
        <div className="container">
          <div className="collection-detail">
            <header>
              <i className="manicon manicon-file-box"></i>
              <div className="collection-title">
                <h1>
                  {attr.title}
                </h1>
                <span className="collection-date">
                  {
                    `Collection created
                    ${moment().month(attr.createdMonth - 1).format("MMMM")},
                    ${attr.createdYear}`
                  }
                </span>
              </div>
            </header>
            <div className="collection-description">
              <p>
                {attr.description}
              </p>
            </div>
            <Utility.ShareBar/>
          </div>
          <ResourceList.Slideshow resources={resources} />
          <ResourceList.Totals count={project.attributes.resourcesCount} projectId={project.id} />
          <ResourceList.Filters kinds={collection.attributes.resourceKinds} />
          <ResourceList.Cards resources={resources} />
        </div>
      </section>

    );
  }
}
