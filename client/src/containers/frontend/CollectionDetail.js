import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import fakeData from 'helpers/fakeData';
import {
  Utility,
  ResourceCollection
} from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, collectionsAPI } from 'api';

const { select, meta } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class CollectionDetailContainer extends PureComponent {

  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const collectionId = params.collectionId;
    const projectId = params.id;
    const projects = projectsAPI.show(params.id);
    const collection = collectionsAPI.show(params.collectionId);
    const collectionResources = collectionsAPI.collectionResources(
      collectionId, { }, { number: page }
    );
    const { promise: one } = dispatch(request(projects, 'project-detail'));
    const { promise: two } = dispatch(request(collection, 'collection-detail'));
    const lookups = ['slideshow-resources', 'collection-resources'];
    const { promise: three } = dispatch(request(collectionResources, lookups));
    return Promise.all([one, two, three]);
  }

  static mapStateToProps(state) {
    const props = {
      project: select('project-detail', state.entityStore),
      collection: select('collection-detail', state.entityStore),
      resources: select('collection-resources', state.entityStore),
      resourcesMeta: meta('collection-resources', state.entityStore),
      slideshowResources: select('slideshow-resources', state.entityStore),
      slideshowResourcesMeta: meta('slideshow-resources', state.entityStore)
    };
    return props;
  }

  static propTypes = {
    project: PropTypes.object,
    collection: PropTypes.object
  };

  constructor() {
    super();
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event, page) {
    const cId = this.props.collection.id;
    const pagination = { number: page };
    const filter = { };
    const action = request(
      collectionsAPI.collectionResources(cId, filter, pagination),
      'collection-resources'
    );
    this.props.dispatch(action);
  }

  pageChangeHandlerCreator(page) {
    return (event) => {
      this.handlePageChange(event, page);
    };
  }

  render() {
    const project = this.props.project;
    const collection = this.props.collection;
    if (!project && !collection) return null;
    return (
      <div>
        <Utility.BackLinkPrimary
          link={`/browse/project/${project.id}`}
          title={project.attributes.title}
        />
        { this.props.slideshowResources && this.props.collectionResources ?
          <ResourceCollection.Detail
            dispatch={this.props.dispatch}
            project={this.props.project}
            slideshowResources={this.props.slideshowResources}
            slideshowPagination={this.props.slideshowResourcesMeta.pagination}
            collectionResources={this.props.resources}
            collectionPagination={this.props.resourcesMeta.pagination}
            collectionPaginationHandler={this.pageChangeHandlerCreator}
            resourceCollection={this.props.collection}

          />
        : null }
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={`/browse/project/${project.id}`}
            title={project.attributes.title}
          />
        </section>
      </div>
    );
  }
}

const CollectionDetail = connect(
    CollectionDetailContainer.mapStateToProps
)(CollectionDetailContainer);

export default CollectionDetail;
