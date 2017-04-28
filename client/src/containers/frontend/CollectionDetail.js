import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Utility, ResourceCollection } from 'components/frontend';
import { browserHistory } from 'react-router';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, collectionsAPI, requests } from 'api';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

const { select, grab, meta, loaded, isEntityLoaded } = entityUtils;
const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class CollectionDetailContainer extends PureComponent {

  static fetchData(getState, dispatch, location, params) {
    const state = getState();
    const promises = [];

    // Load project, unless it is already loaded
    if (!isEntityLoaded('projects', params.id, state)) {
      const p = projectsAPI.show(params.id);
      const { promise } = dispatch(request(p, requests.tmpProject));
      promises.push(promise);
    }

    // Load the collection, unless it is already loaded
    if (!isEntityLoaded('collections', params.collectionId, state)) {
      const c = collectionsAPI.show(params.collectionId);
      const { promise } = dispatch(request(c, requests.feCollection));
      promises.push(promise);
    }

    // Load the collection resources, unless they have already been loaded
    if (!loaded(requests.feCollectionResources, state.entityStore)) {
      const filter = location.query ? location.query : {};
      const pp = params.page ? params.page : page;
      const cr = collectionsAPI.collectionResources(
        params.collectionId, filter, { number: pp, size: perPage }
      );
      const lookups = [requests.feSlideshow, requests.feCollectionResources];
      const { promise } = dispatch(request(cr, lookups));
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    const props = {
      project: grab('projects', ownProps.params.id, state.entityStore),
      collection: grab('collections', ownProps.params.collectionId, state.entityStore),
      resources: select(requests.feCollectionResources, state.entityStore),
      resourcesMeta: meta(requests.feCollectionResources, state.entityStore),
      slideshowResources: select(requests.feSlideshow, state.entityStore),
      slideshowResourcesMeta: meta(requests.feSlideshow, state.entityStore)
    };
    return props;
  }

  static propTypes = {
    project: PropTypes.object,
    collection: PropTypes.object,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(this.props.location.query);
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.flushStoreRequests = this.flushStoreRequests.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentWillUnmount() {
    this.flushStoreRequests();
  }

  initialState(init) {
    const filters = init ? init : {};
    return ({
      filter: filters
    });
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
    const filter = this.state.filter;
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
      this.updateUrl(filter);
    });
  }

  updateUrl(stateFilter) {
    const base = this.props.location.pathname;
    const filter = stateFilter;
    if (filter.collection_order) delete filter.collection_order;
    browserHistory.push({ pathname: base, query: filter });
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

    const filter = get(this.props, 'location.query');
    const initialFilter = filter ? filter : null;

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
            initialFilterState={initialFilter}
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
