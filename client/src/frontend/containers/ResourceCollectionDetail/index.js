import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import ResourceCollection from "frontend/components/resource-collection";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { resourceCollectionsAPI, requests } from "api";
import HeadContent from "global/components/HeadContent";
import queryString from "query-string";
import debounce from "lodash/debounce";
import omitBy from "lodash/omitBy";
import isNull from "lodash/isNull";
import lh from "helpers/linkHandler";
import BackLink from "frontend/components/back-link";
import withSettings from "hoc/with-settings";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

export class ResourceCollectionDetailContainer extends PureComponent {
  static fetchCollection(id, dispatch) {
    const c = resourceCollectionsAPI.show(id);
    const { promise } = dispatch(request(c, requests.feResourceCollection));
    return promise;
  }

  static fetchResources(
    metas,
    id,
    dispatch,
    filter = {},
    pagination = { number: page, size: perPage }
  ) {
    const cr = resourceCollectionsAPI.collectionResources(
      id,
      filter,
      pagination
    );
    const { promise } = dispatch(request(cr, metas));
    return promise;
  }

  static fetchData = (getState, dispatch, location, match) => {
    const self = ResourceCollectionDetailContainer;
    const state = getState();
    const { resourceCollectionId } = match.params;
    const promises = [];
    const params = queryString.parse(location.search);
    const filter = omitBy(params, (v, k) => k === "page");
    const pagination = {
      number: params.page ? params.page : page,
      size: perPage
    };
    const isFirstPage = pagination.number === 1;

    // Load the collection, unless it is already loaded
    if (!isEntityLoaded("resourceCollections", resourceCollectionId, state)) {
      promises.push(self.fetchCollection(resourceCollectionId, dispatch));
    }

    // Load the collection's resources. If we're on page 1, then the slideshow has the
    // same resources, so we apply the results to both metas.
    const resourcesMetas = [requests.feCollectionResources];
    if (isFirstPage) resourcesMetas.push(requests.feSlideshow);
    const gridResourcesPromise = self.fetchResources(
      resourcesMetas,
      resourceCollectionId,
      dispatch,
      filter,
      pagination
    );
    promises.push(gridResourcesPromise);

    // If we're not on the first page, load the first page of resources for the slideshow.
    if (!isFirstPage) {
      const slideshowResourcesPromise = self.fetchResources(
        requests.feSlideshow,
        resourceCollectionId,
        dispatch
      );
      promises.push(slideshowResourcesPromise);
    }

    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    const props = {
      resourceCollection: grab(
        "resourceCollections",
        ownProps.match.params.resourceCollectionId,
        state.entityStore
      ),
      resources: select(requests.feCollectionResources, state.entityStore),
      resourcesMeta: meta(requests.feCollectionResources, state.entityStore),
      slideshowResources: select(requests.feSlideshow, state.entityStore),
      slideshowResourcesMeta: meta(requests.feSlideshow, state.entityStore)
    };
    return omitBy(props, isNull);
  };

  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    slideshowResources: PropTypes.array,
    slideshowResourcesMeta: PropTypes.object,
    project: PropTypes.object,
    resourceCollection: PropTypes.object,
    settings: PropTypes.object.isRequired,
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(queryString.parse(props.location.search));
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search === this.props.location.search) return null;
    this.setState(
      this.initialState(queryString.parse(this.props.location.search)),
      this.updateResults
    );
  }

  componentWillUnmount() {
    this.flushStoreRequests();
  }

  initialState(init) {
    const filter = omitBy(init, (vIgnored, k) => k === "page");

    return {
      filter: { ...filter },
      pagination: {
        number: init.page || page,
        size: perPage
      }
    };
  }

  flushStoreRequests = () => {
    this.props.dispatch(flush(requests.feSlideshow));
    this.props.dispatch(flush(requests.feResourceCollection));
    this.props.dispatch(flush(requests.feCollectionResources));
  };

  doUpdate() {
    this.updateResults();
    this.updateUrl();
  }

  updateResults() {
    const cId = this.props.resourceCollection.id;
    const action = request(
      resourceCollectionsAPI.collectionResources(
        cId,
        this.state.filter,
        this.state.pagination
      ),
      requests.feCollectionResources
    );
    this.props.dispatch(action);
  }

  updateUrl() {
    const pathname = this.props.location.pathname;
    const filters = this.state.filter;
    if (filters.collection_order) delete filters.collection_order;
    const pageParam = this.state.pagination.number;
    const params = { ...filters };
    if (pageParam !== 1) params.page = pageParam;

    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
  }

  filterChange = filter => {
    const pagination = { ...this.state.pagination, number: page };
    this.setState({ filter, pagination }, this.doUpdate);
  };

  handlePageChange = pageParam => {
    const pagination = { ...this.state.pagination, number: pageParam };
    this.setState({ pagination }, this.doUpdate);
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  render() {
    const { project, resourceCollection, settings } = this.props;
    const filter = this.state.filter;
    const initialFilter = filter || null;
    if (!project || !resourceCollection) return null;

    const resourceCollectionUrl = lh.link(
      "frontendProjectResourceCollection",
      project.attributes.slug,
      resourceCollection.attributes.slug
    );
    return (
      <div>
        <EventTracker
          event={EVENTS.VIEW_RESOURCE}
          resource={this.props.resourceCollection}
        />
        <CheckFrontendMode
          debugLabel="ResourceCollectionDetail"
          isProjectSubpage
        />

        <HeadContent
          title={`\u201c${resourceCollection.attributes.title}\u201d on ${settings.attributes.general.installationName}`}
          description={resourceCollection.attributes.description}
          image={resourceCollection.attributes.thumbnailStyles.medium}
        />
        <BackLink.Register
          link={lh.link("frontendProjectDetail", project.attributes.slug)}
          title={project.attributes.titlePlaintext}
        />
        {this.props.slideshowResources && this.props.resources ? (
          <ResourceCollection.Detail
            dispatch={this.props.dispatch}
            project={this.props.project}
            slideshowResources={this.props.slideshowResources}
            slideshowPagination={this.props.slideshowResourcesMeta.pagination}
            collectionResources={this.props.resources}
            resourceCollectionPagination={this.props.resourcesMeta.pagination}
            resourceCollectionPaginationHandler={this.pageChangeHandlerCreator}
            resourceCollection={this.props.resourceCollection}
            resourceCollectionUrl={resourceCollectionUrl}
            filterChange={this.filterChange}
            initialFilterState={initialFilter}
          />
        ) : null}
      </div>
    );
  }
}

export default connectAndFetch(withSettings(ResourceCollectionDetailContainer));
