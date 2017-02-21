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
import debounce from 'lodash/debounce';

const { select, meta } = entityUtils;
const { request, flush, requests } = entityStoreActions;
const page = 1;
const perPage = 10;

class CollectionDetailContainer extends PureComponent {

  static fetchData(getState, dispatch, location, params) {
    const pageParam = params.page ? params.page : page;
    const collectionId = params.collectionId;
    const projectId = params.id;
    const projects = projectsAPI.show(params.id);
    const collection = collectionsAPI.show(params.collectionId);
    const collectionResources = collectionsAPI.collectionResources(
      collectionId, { }, { number: pageParam, size: perPage }
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
    this.filterChange = this.filterChange.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  handlePageChange(event, pageParam) {
    const cId = this.props.collection.id;
    const pagination = { number: pageParam, size: perPage };
    const filter = { };
    const action = request(
      collectionsAPI.collectionResources(cId, filter, pagination),
      'collection-resources'
    );
    this.props.dispatch(action);
  }

  pageChangeHandlerCreator(pageParam) {
    return (event) => {
      this.handlePageChange(event, pageParam);
    };
  }

  filterChange(filter) {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  }

  updateResults() {
    const cId = this.props.collection.id;
    const pagination = { number: page, size: perPage };
    const action = request(
      collectionsAPI.collectionResources(cId, this.state.filter, pagination),
      'collection-resources'
    );
    this.props.dispatch(action);
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
        { this.props.slideshowResources && this.props.resources ?
          <ResourceCollection.Detail
            dispatch={this.props.dispatch}
            project={this.props.project}
            slideshowResources={this.props.slideshowResources}
            slideshowPagination={this.props.slideshowResourcesMeta.pagination}
            collectionResources={this.props.resources}
            collectionPagination={this.props.resourcesMeta.pagination}
            collectionPaginationHandler={this.pageChangeHandlerCreator}
            collection={this.props.collection}
            filterChange={this.filterChange}
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
