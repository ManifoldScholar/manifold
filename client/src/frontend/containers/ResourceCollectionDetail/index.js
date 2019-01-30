import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import ResourceCollection from "frontend/components/resource-collection";
import Utility from "frontend/components/utility";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { projectsAPI, resourceCollectionsAPI, requests } from "api";
import HeadContent from "global/components/HeadContent";
import queryString from "query-string";
import debounce from "lodash/debounce";
import omitBy from "lodash/omitBy";
import isNull from "lodash/isNull";
import lh from "helpers/linkHandler";

import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

export class ResourceCollectionDetailContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];

    // Load project, unless it is already loaded
    if (!isEntityLoaded("projects", match.params.id, state)) {
      const p = projectsAPI.show(match.params.id);
      const { promise } = dispatch(request(p, requests.tmpProject));
      promises.push(promise);
    }

    // Load the collection, unless it is already loaded
    if (
      !isEntityLoaded(
        "resourceCollections",
        match.params.resourceCollectionId,
        state
      )
    ) {
      const c = resourceCollectionsAPI.show(match.params.resourceCollectionId);
      const { promise } = dispatch(request(c, requests.feResourceCollection));
      promises.push(promise);
    }

    const params = queryString.parse(location.search);
    const pagination = {
      number: params.page ? params.page : page,
      size: perPage
    };
    const filter = omitBy(params, (v, k) => k === "page");
    const cr = resourceCollectionsAPI.collectionResources(
      match.params.resourceCollectionId,
      filter,
      pagination
    );
    const lookups = [requests.feSlideshow, requests.feCollectionResources];
    const { promise } = dispatch(request(cr, lookups));
    promises.push(promise);

    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    const props = {
      project: grab("projects", ownProps.match.params.id, state.entityStore),
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
      filter: Object.assign({}, filter),
      pagination: {
        number: init.page || page,
        size: perPage
      }
    };
  }

  flushStoreRequests = () => {
    this.props.dispatch(flush(requests.tmpProject));
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
    const params = Object.assign({}, filters);
    if (pageParam !== 1) params.page = pageParam;

    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
  }

  filterChange = filter => {
    const pagination = Object.assign({}, this.state.pagination, {
      number: page
    });
    this.setState({ filter, pagination }, this.doUpdate);
  };

  handlePageChange = pageParam => {
    const pagination = Object.assign({}, this.state.pagination, {
      number: pageParam
    });
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
        <HeadContent
          title={`\u201c${resourceCollection.attributes.title}\u201d on ${
            settings.attributes.general.installationName
          }`}
          description={resourceCollection.attributes.description}
          image={resourceCollection.attributes.thumbnailStyles.medium}
        />
        <Utility.BackLinkPrimary
          link={lh.link("frontendProject", project.attributes.slug)}
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
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={lh.link("frontendProject", project.attributes.slug)}
            title={project.attributes.titlePlaintext}
          />
        </section>
      </div>
    );
  }
}

export default connectAndFetch(withSettings(ResourceCollectionDetailContainer));
