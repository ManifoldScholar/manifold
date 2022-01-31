import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "frontend/components/layout";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { projectCollectionsAPI, projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import omitBy from "lodash/omitBy";
import queryString from "query-string";
import debounce from "lodash/debounce";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import has from "lodash/has";
import withSettings from "hoc/withSettings";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";

const { request, flush } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

export class ProjectCollectionDetailContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];
    const projectCollectionId = match.params.id;

    if (!isEntityLoaded("projectCollections", projectCollectionId, state)) {
      const projectCollectionRequest = request(
        projectCollectionsAPI.show(match.params.id),
        requests.feProjectCollection
      );
      const { promise } = dispatch(projectCollectionRequest);

      promises.push(promise);
    }

    const search = queryString.parse(location.search);

    const baseFilters = {
      collectionOrder: projectCollectionId
    };

    const { page, ...filters } = search;
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };

    const projectsFetch = projectsAPI.index(
      Object.assign(baseFilters, filters),
      pagination
    );

    const projectsAction = request(
      projectsFetch,
      requests.feCollectionProjects
    );
    const { promise: one } = dispatch(projectsAction);
    promises.push(one);
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      projectCollection: grab(
        "projectCollections",
        ownProps.match.params.id,
        state.entityStore
      ),
      projects: select(requests.feCollectionProjects, state.entityStore),
      projectsMeta: meta(requests.feCollectionProjects, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    projectCollection: PropTypes.object,
    authentication: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object,
    match: PropTypes.object
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
    this.props.dispatch(flush(requests.feProjectCollection));
  }

  initialFilterState(init = {}) {
    const filter = omitBy(init, (vIgnored, k) => k === "page");
    // filter.collectionOrder = projectCollectionId;
    return filter;
  }

  initialState(init = {}) {
    return {
      filter: { ...this.initialFilterState(init) },
      pagination: {
        number: init.page || defaultPage,
        size: perPage
      }
    };
  }

  updateUrl() {
    const pathname = this.props.location.pathname;
    const filters = this.state.filter;
    const pageParam = this.state.pagination.number;
    const params = { ...filters };
    if (pageParam !== 1) params.page = pageParam;

    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
  }

  updateResults(filter = this.state.filter) {
    const updatedFilter = {
      ...filter,
      collectionOrder: this.props.projectCollection.id
    };

    const action = request(
      projectsAPI.index(updatedFilter, this.state.pagination),
      requests.feCollectionProjects
    );
    this.props.dispatch(action);
  }

  doUpdate() {
    this.updateResults();
    this.updateUrl();
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, this.doUpdate);
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

  get projectCollection() {
    return this.props.projectCollection;
  }

  get projects() {
    return this.props.projects;
  }

  get projectsMeta() {
    return this.props.projectsMeta;
  }

  get ogDescription() {
    const { projectCollection } = this.props;
    if (!projectCollection) return null;
    const {
      descriptionPlaintext,
      socialDescription
    } = projectCollection.attributes;
    return socialDescription || descriptionPlaintext;
  }

  get ogTitle() {
    const { projectCollection, settings } = this.props;
    if (!projectCollection || !settings) return null;
    const { socialTitle, title } = projectCollection.attributes;
    return (
      socialTitle ||
      `\u201c${title}\u201d on ${settings.attributes.general.installationName}`
    );
  }

  get ogImage() {
    const { projectCollection } = this.props;
    if (!projectCollection) return null;
    const { socialImageStyles, heroStyles } = projectCollection.attributes;
    if (has(socialImageStyles, "mediumLandscape"))
      return socialImageStyles.mediumLandscape;
    if (has(heroStyles, "mediumLandscape")) return heroStyles.mediumLandscape;
    return null;
  }

  render() {
    if (!this.projectCollection) return null;

    return (
      <div>
        <CheckFrontendMode
          debugLabel="ProjectCollectionDetail"
          isProjectSubpage
        />
        {this.projectCollection && (
          <EventTracker
            event={EVENTS.VIEW_RESOURCE}
            resource={this.props.projectCollection}
          />
        )}
        <RegisterBreadcrumbs
          breadcrumbs={[
            {
              to: lh.link("frontendProjectCollections"),
              label: "Back to Project Collections"
            }
          ]}
        />
        <HeadContent
          title={this.ogTitle}
          description={this.ogDescription}
          image={this.ogImage}
        />
        <h1 className="screen-reader-text">
          {this.projectCollection.attributes.title}
        </h1>
        <EntityCollection.ProjectCollectionDetail
          projectCollection={this.projectCollection}
          projects={this.projects}
          projectsMeta={this.projectsMeta}
          filterProps={{
            filterChangeHandler: this.filterChangeHandler,
            initialFilterState: this.state.filter || {},
            resetFilterState: this.initialFilterState()
          }}
          paginationProps={{
            paginationClickHandler: this.pageChangeHandlerCreator
          }}
          bgColor="neutral05"
        />
        <Layout.ButtonNavigation
          showProjects={false}
          grayBg={false}
          showProjectCollections
          hideAtNarrow
        />
      </div>
    );
  }
}

export default connectAndFetch(withSettings(ProjectCollectionDetailContainer));
