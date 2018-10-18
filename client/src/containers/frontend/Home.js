import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList, Layout, ProjectCollection } from "components/frontend";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { entityStoreActions } from "actions";
import { select, meta, isLoaded } from "utils/entityUtils";
import { projectsAPI, featuresAPI, projectCollectionsAPI, requests } from "api";
import get from "lodash/get";
import isArray from "lodash/isArray";
import lh from "helpers/linkHandler";
import queryString from "query-string";
import size from "lodash/size";

// const { setProjectFilters } = uiFilterActions;
const { request } = entityStoreActions;
const perPage = 20;

export class HomeContainer extends Component {
  static fetchProjects = (dispatch, location) => {
    const query = queryString.parse(location.search);
    const filters = {
      order: "sort_title, title",
      featured: query.featured,
      subject: query.subject
    };
    const pagination = {
      number: query.page || 1,
      size: perPage
    };
    const filteredRequest = request(
      projectsAPI.index(filters, pagination),
      requests.feProjectsFiltered
    );
    return dispatch(filteredRequest);
  };

  static fetchData = (getState, dispatch, location) => {
    const promises = [];
    const featuredRequest = request(
      projectsAPI.featured(),
      requests.feProjectsFeatured
    );
    const collectionRequest = request(
      projectCollectionsAPI.index({
        visible: true,
        showOnHomepage: true,
        projects: true,
        order: "position ASC"
      }),
      requests.feProjectCollections
    );
    const { promise: one } = HomeContainer.fetchProjects(dispatch, location);
    const { promise: two } = dispatch(featuredRequest);
    const { promise: three } = dispatch(collectionRequest);
    promises.push(one);
    promises.push(two);
    promises.push(three);

    if (!isLoaded(requests.feFeatures, getState())) {
      const featuresRequest = request(
        featuresAPI.index({ home: true }),
        requests.feFeatures
      );
      const { promise: four } = dispatch(featuresRequest);
      promises.push(four);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      features: select(requests.feFeatures, state.entityStore),
      filteredProjects: select(requests.feProjectsFiltered, state.entityStore),
      projectCollections: select(
        requests.feProjectCollections,
        state.entityStore
      ),
      subjects: select(requests.feSubjects, state.entityStore),
      meta: meta(requests.feProjectsFiltered, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    authentication: PropTypes.object,
    projectCollections: PropTypes.array,
    filteredProjects: PropTypes.array,
    features: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    fetchData: PropTypes.func.isRequired,
    subjects: PropTypes.array,
    meta: PropTypes.object
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.authentication.currentUser !==
      prevProps.authentication.currentUser
    ) {
      this.props.fetchData(this.props);
    }
    if (prevProps.location !== this.props.location) {
      HomeContainer.fetchProjects(this.props.dispatch, this.props.location);
    }
  }

  currentQuery() {
    return queryString.parse(this.props.location.search);
  }

  handlePageChange = (event, page) => {
    event.preventDefault();
    const query = Object.assign({}, this.currentQuery(), { page });
    this.doQuery(query);
  };

  doQuery(query) {
    const url = lh.link("frontend", query);
    this.props.history.push(url);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
    };
  };

  showPlaceholder() {
    const { location, filteredProjects } = this.props;
    if (location.search) return false; // There are search filters applied, skip the check
    if (!filteredProjects || filteredProjects.length === 0) return true;
  }

  renderProjectCollections() {
    if (!this.props.projectCollections) return null;

    return this.props.projectCollections.map((projectCollection, index) => {
      return (
        <ProjectCollection.Summary
          key={projectCollection.id}
          authentication={this.props.authentication}
          projectCollection={projectCollection}
          dispatch={this.props.dispatch}
          ordinal={index}
        />
      );
    });
  }

  renderProjectLibrary() {
    if (this.showPlaceholder()) return <ProjectList.Placeholder />;

    return (
      <section className="bg-neutral05">
        <div className="container project-list-container extra-top">
          <header className="section-heading">
            <div className="main">
              <i
                className="manicon manicon-books-on-shelf"
                aria-hidden="true"
              />
              <div className="body">
                <h4 className="title">{"Our Projects"}</h4>
              </div>
            </div>
          </header>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            dispatch={this.props.dispatch}
            projects={this.props.filteredProjects}
            limit={16}
            viewAllUrl={lh.link("frontendProjects")}
          />
        </div>
      </section>
    );
  }

  render() {
    const feature = isArray(this.props.features)
      ? this.props.features[0]
      : null;

    return (
      <div
        style={{
          overflowX: "hidden"
        }}
      >
        {feature ? (
          <Layout.Splash
            feature={feature}
            authenticated={this.props.authentication.authenticated}
            toggleSignInUpOverlay={this.commonActions.toggleSignInUpOverlay}
          />
        ) : null}
        {this.renderProjectCollections()}
        {size(this.props.projectCollections) > 0
          ? null
          : this.renderProjectLibrary()}
        <Layout.ButtonNavigation
          grayBg={false}
          showFollowing={!this.showPlaceholder()}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(HomeContainer);
