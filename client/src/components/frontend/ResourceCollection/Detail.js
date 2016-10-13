import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

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
    const resourceCollection = this.props.resourceCollection;
    const resources = resourceCollection.relationships.resources;

    return (
      <section>
        <div className="container">
          <div className="collection-detail">
            <header>
              <i className="manicon manicon-file-box"></i>
              <div className="collection-title">
                <h1>
                  {'Collection Title'}
                </h1>
                <span className="collection-date">
                    {'Collection created January 2016'}
                  </span>
              </div>
            </header>
            <div className="collection-description">
              <p>
                Maecenas sed diam eget risus varius blandit sit amet non magna.
                Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                Donec sed odio dui.
              </p>
            </div>
            <Utility.ShareBar/>
          </div>

          <ResourceList.Slideshow resources={resources} />
          <ResourceList.Totals count={2028} projectId={project.id} />
          <ResourceList.Filters />
          <ResourceList.Thumbnails resources={resources} />
        </div>W
      </section>

    );
  }
}
