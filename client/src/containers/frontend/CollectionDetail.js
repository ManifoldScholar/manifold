import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connectAndFetch from 'utils/connectAndFetch';
import { Utility, ResourceCollection } from 'components/frontend';
import { HigherOrder } from 'components/global';
import { entityStoreActions } from 'actions';
import { select, grab, meta, loaded, isEntityLoaded } from 'utils/entityUtils';
import { projectsAPI, collectionsAPI, requests } from 'api';
import queryString from 'query-string';
import debounce from 'lodash/debounce';
import omitBy from 'lodash/omitBy';
import isNull from 'lodash/isNull';
import lh from 'helpers/linkHandler';

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class CollectionDetailContainer extends PureComponent {

  static fetchData(getState, dispatch, location, match) {
    const state = getState();
    const filter = queryString.parse(location.search);
    const promises = [];

    // Load project, unless it is already loaded
    if (!isEntityLoaded('projects', match.params.id, state)) {
      const p = projectsAPI.show(match.params.id);
      const { promise } = dispatch(request(p, requests.tmpProject));
      promises.push(promise);
    }

    // Load the collection, unless it is already loaded
    if (!isEntityLoaded('collections', match.params.collectionId, state)) {
      const c = collectionsAPI.show(match.params.collectionId);
      const { promise } = dispatch(request(c, requests.feCollection));
      promises.push(promise);
    }

    // Load the collection resources, unless they have already been loaded
    if (!loaded(requests.feCollectionResources, state.entityStore)) {
      const pp = match.params.page ? match.params.page : page;
      const cr = collectionsAPI.collectionResources(
        match.params.collectionId, filter, { number: pp, size: perPage }
      );
      const lookups = [requests.feSlideshow, requests.feCollectionResources];
      const { promise } = dispatch(request(cr, lookups));
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    const props = {
      project: grab('projects', ownProps.match.params.id, state.entityStore),
      collection: grab('collections', ownProps.match.params.collectionId, state.entityStore),
      resources: select(requests.feCollectionResources, state.entityStore),
      resourcesMeta: meta(requests.feCollectionResources, state.entityStore),
      slideshowResources: select(requests.feSlideshow, state.entityStore),
      slideshowResourcesMeta: meta(requests.feSlideshow, state.entityStore)
    };
    return omitBy(props, isNull);
  }

  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    slideshowResources: PropTypes.array,
    slideshowResourcesMeta: PropTypes.object,
    project: PropTypes.object,
    collection: PropTypes.object,
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(queryString.parse(this.props.location.search));
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
    const filter = stateFilter;
    if (filter.collection_order) delete filter.collection_order;
    const pathname = this.props.location.pathname;
    const search = queryString.stringify(filter);
    this.props.history.push({ pathname, search });
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

    const filter = this.state.filter;
    const initialFilter = filter ? filter : null;

    if (!project || !collection) return null;
    const collectionUrl = lh.link("frontendProjectCollection", project.id, collection.id);

    return (
      <div>
        <Utility.BackLinkPrimary
          link={lh.link("frontendProject", project.id)}
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
            link={lh.link("frontendProject", project.id)}
            title={project.attributes.title}
          />
        </section>
      </div>
    );
  }
}

export default connectAndFetch(CollectionDetailContainer);
