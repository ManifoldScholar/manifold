import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import FormattedDate from 'components/global/FormattedDate';
import {
  Utility,
  ResourceList
} from 'components/frontend';

export default class ResourceCollectionDetail extends PureComponent {

  static displayName = "ResourceCollection.Detail";

  static propTypes = {
    collection: PropTypes.object,
    project: PropTypes.object,
    slideshowResources: PropTypes.array,
    slideshowPagination: PropTypes.object,
    collectionResources: PropTypes.array,
    collectionPagination: PropTypes.object,
    collectionPaginationHandler: PropTypes.func,
    dispatch: PropTypes.func
  };

  render() {
    const project = this.props.project;
    const collection = this.props.collection;
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
                  <FormattedDate
                    prefix="Collection created"
                    format="MMMM, YYYY"
                    date={attr.createdAt}
                  />
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
          <ResourceList.Slideshow
            collectionId={this.props.collection.id}
            collectionResources={this.props.slideshowResources}
            count={project.attributes.resourcesCount}
            pagination={this.props.slideshowPagination}
            dispatch={this.props.dispatch}
          />
          <a id="pagination-target" name="pagination-target"></a>
          <ResourceList.Totals
            belongsTo="collection"
            count={project.attributes.resourcesCount}
            projectId={project.id}
          />
          <ResourceList.Filters kinds={collection.attributes.resourceKinds} />
          <ResourceList.Cards
            context={this.props.collection}
            resources={this.props.collectionResources}
            pagination={this.props.collectionPagination}
            paginationClickHandler={this.props.collectionPaginationHandler}
          />
        </div>
      </section>

    );
  }
}
