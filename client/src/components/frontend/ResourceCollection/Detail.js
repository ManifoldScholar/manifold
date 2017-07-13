import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";
import { Utility, ResourceList } from "components/frontend";
import { HeadContent } from "components/global";

export default class ResourceCollectionDetail extends PureComponent {
  static displayName = "ResourceCollection.Detail";

  static propTypes = {
    collection: PropTypes.object,
    project: PropTypes.object,
    collectionUrl: PropTypes.string.isRequired,
    slideshowResources: PropTypes.array,
    slideshowPagination: PropTypes.object,
    collectionResources: PropTypes.array,
    collectionPagination: PropTypes.object,
    collectionPaginationHandler: PropTypes.func,
    dispatch: PropTypes.func,
    filterChange: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const collection = this.props.collection;
    if (!project || !collection) return null;

    const attr = collection.attributes;
    const count = attr.collectionResourcesCount;

    return (
      <section>
        <HeadContent
          title={`Manifold Scholarship | ${collection.attributes.title}`}
          description={collection.attributes.description}
          image={collection.attributes.thumbnailStyles.mediumSquare}
        />
        <div className="container">
          <div className="collection-detail">
            <header>
              <i className="manicon manicon-file-box" />
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
            <Utility.ShareBar url={this.props.collectionUrl} />
          </div>
          <ResourceList.Slideshow
            collectionId={this.props.collection.id}
            collectionResources={this.props.slideshowResources}
            count={project.attributes.resourcesCount}
            pagination={this.props.slideshowPagination}
            dispatch={this.props.dispatch}
          />
          <ResourceList.Totals
            belongsTo="collection"
            count={count}
            projectId={project.id}
          />
          <ResourceList.Filters
            kinds={collection.attributes.resourceKinds}
            tags={collection.attributes.resourceTags}
            initialFilterState={this.props.initialFilterState}
            filterChangeHandler={this.props.filterChange}
          />
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
