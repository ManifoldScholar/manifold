import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "frontend/components/layout";
import Utility from "frontend/components/utility";
import ProjectCollection from "frontend/components/project-collection";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { projectCollectionsAPI, projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/head-content";
import omitBy from "lodash/omitBy";
import queryString from "query-string";
import debounce from "lodash/debounce";

import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;
const page = 1;
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

    const params = queryString.parse(location.search);
    const pagination = {
      number: params.page ? params.page : page,
      size: perPage
    };
    const filter = omitBy(params, (v, k) => k === "page");
    filter.collectionOrder = projectCollectionId;
    const projectsRequest = request(
      projectsAPI.index(filter, pagination),
      requests.feCollectionProjects
    );
    const { promise } = dispatch(projectsRequest);
    promises.push(promise);

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

  updateResults(filter = this.state.filter) {
    const updatedFilter = Object.assign({}, filter, {
      collectionOrder: this.props.projectCollection.id
    });

    const action = request(
      projectsAPI.index(updatedFilter, this.state.pagination),
      requests.feCollectionProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.updateResults(filter);
    });
  };

  handlePageChange = pageParam => {
    const pagination = Object.assign({}, this.state.pagination, {
      number: pageParam
    });
    this.setState({ pagination }, this.updateResults);
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  renderProjects(props) {
    if (!props.projects || !props.projectsMeta) return null;

    return (
      <ProjectCollection.Detail
        projectCollection={props.projectCollection}
        projects={props.projects}
        pagination={props.projectsMeta.pagination}
        paginationClickHandler={this.pageChangeHandlerCreator}
        authentication={props.authentication}
        filterChangeHandler={this.filterChangeHandler}
        initialState={this.state.filter || {}}
        dispatch={this.props.dispatch}
      />
    );
  }

  render() {
    const { projectCollection, settings } = this.props;
    if (!projectCollection) return null;

    return (
      <div>
        <Utility.BackLinkPrimary
          link={lh.link("frontendProjectCollections")}
          backText={"Back to Project Collections"}
        />
        <HeadContent
          title={`\u201c${
            this.props.projectCollection.attributes.title
          }\u201d on ${settings.attributes.general.installationName}`}
          description={
            this.props.projectCollection.attributes.descriptionPlaintext
          }
        />
        {this.renderProjects(this.props)}
        <Layout.ButtonNavigation
          showFollowing={false}
          showProjects={false}
          grayBg={false}
          showProjectCollections
          hideAtNarrow
        />
      </div>
    );
  }
}

export default connectAndFetch(
  withSettings(ProjectCollectionDetailContainer)
);