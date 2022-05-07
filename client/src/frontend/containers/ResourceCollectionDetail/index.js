import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { withTranslation } from "react-i18next";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { resourceCollectionsAPI, requests } from "api";
import queryString from "query-string";
import debounce from "lodash/debounce";
import omitBy from "lodash/omitBy";
import isNull from "lodash/isNull";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import withSettings from "hoc/withSettings";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityHeadContent from "frontend/components/entity/HeadContent";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import EntityCollection from "frontend/components/entity/Collection";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;
const PAGINATION_TARGET = "collection-list-header";

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
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object,
    history: PropTypes.object,
    journalBreadcrumbs: PropTypes.array,
    t: PropTypes.func
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

  initialState(init = {}) {
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
    this.props.history.push({
      pathname,
      search,
      hash: `#${PAGINATION_TARGET}`
    });
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

  breadcrumbs() {
    const { journalBreadcrumbs, resourceCollection, project } = this.props;
    const projectCrumb = {
      to: lh.link("frontendProject", project.attributes.slug),
      label: project.attributes.titlePlaintext
    };
    const resourcesCrumb = {
      to: lh.link(
        "frontendProjectResourceCollections",
        project.attributes.slug
      ),
      label: this.props.t("glossary.resource_collection_other")
    };
    const collectionCrumb = resourceCollection
      ? {
          to: lh.link(
            "frontendProjectResourceCollection",
            this.props.project.attributes.slug,
            this.props.resourceCollection.attributes.slug
          ),
          label: resourceCollection.attributes.title
        }
      : null;
    return journalBreadcrumbs
      ? [...journalBreadcrumbs, resourcesCrumb, collectionCrumb].filter(Boolean)
      : [projectCrumb, resourcesCrumb, collectionCrumb].filter(Boolean);
  }

  render() {
    const {
      project,
      resourceCollection,
      resources,
      resourcesMeta,
      slideshowResources,
      slideshowResourcesMeta,
      dispatch
    } = this.props;

    const filterState = Object.fromEntries(
      Object.entries(this.state.filter).filter(
        ([key]) => !key.includes("collection_order")
      )
    );

    if (!project || !resourceCollection) return null;

    return (
      <>
        <EventTracker
          event={EVENTS.VIEW_RESOURCE}
          resource={this.props.resourceCollection}
        />
        <CheckFrontendMode
          debugLabel="ResourceCollectionDetail"
          isProjectSubpage
        />
        <EntityHeadContent entity={resourceCollection} parentEntity={project} />
        <RegisterBreadcrumbs breadcrumbs={this.breadcrumbs()} />
        <EntityCollection.ProjectResourceCollectionDetail
          resourceCollection={resourceCollection}
          resources={resources ?? []}
          project={project}
          meta={resourcesMeta}
          slideshowResources={slideshowResources}
          slideshowResourcesMeta={slideshowResourcesMeta}
          dispatch={dispatch}
          paginationProps={{
            paginationClickHandler: this.pageChangeHandlerCreator,
            paginationTarget: `#${PAGINATION_TARGET}`
          }}
          filterProps={{
            onFilterChange: this.filterChange,
            initialState: filterState,
            resetState: {}
          }}
          listHeaderId={PAGINATION_TARGET}
        />
      </>
    );
  }
}

export default withTranslation()(
  connectAndFetch(withSettings(ResourceCollectionDetailContainer))
);
