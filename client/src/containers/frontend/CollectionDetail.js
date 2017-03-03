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
import { projectsAPI, collectionsAPI, requests } from 'api';
import debounce from 'lodash/debounce';

const { select, meta } = entityUtils;
const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class CollectionDetailContainer extends PureComponent {

  static fetchData(getState, dispatch, location, params) {
    const pageParam = params.page ? params.page : page;
    const collectionId = params.collectionId;
    const projects = projectsAPI.show(params.id);
    const collection = collectionsAPI.show(params.collectionId);
    const collectionResources = collectionsAPI.collectionResources(
      collectionId, { }, { number: pageParam, size: perPage }
    );
    const { promise: one } = dispatch(request(projects, requests.tmpProject));
    const { promise: two } = dispatch(request(collection, requests.feCollection));
    const lookups = [requests.feSlideshow, requests.feCollectionResources];
    const { promise: three } = dispatch(request(collectionResources, lookups));
    return Promise.all([one, two, three]);
  }

  static mapStateToProps(state) {
    const props = {
      project: select(requests.tmpProject, state.entityStore),
      collection: select(requests.feCollection, state.entityStore),
      resources: select(requests.feCollectionResources, state.entityStore),
      resourcesMeta: meta(requests.feCollectionResources, state.entityStore),
      slideshowResources: select(requests.feSlideshow, state.entityStore),
      slideshowResourcesMeta: meta(requests.feSlideshow, state.entityStore)
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
    this.flushStoreRequests = this.flushStoreRequests.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentWillUnmount() {
    this.flushStoreRequests();
  }

  flushStoreRequests() {
    this.props.dispatch(flush(requests.tmpProject));
    this.props.dispatch(flush(requests.feSlideshow));
    this.props.dispatch(flush(requests.feCollection));
    this.props.dispatch(flush(requests.feCollectionResources));
  }

  handlePageChange(event, pageParam) {
    const cId = this.props.collection.id;
    const pagination = { number: pageParam, size: perPage };
    const filter = { };
    const action = request(
      collectionsAPI.collectionResources(cId, filter, pagination),
      requests.feCollectionResources
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
      requests.feCollectionResources
    );
    this.props.dispatch(action);
  }

  render() {
    const project = this.props.project;
    const collection = this.props.collection;

    if (!project || !collection) return null;

    const collectionUrl = `/browse/project/${project.id}/collection/${collection.id}`;

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
            collectionUrl={collectionUrl}
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
