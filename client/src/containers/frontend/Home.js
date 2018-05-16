import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ProjectList, Layout } from "components/frontend";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, featuresAPI, requests } from "api";
import get from "lodash/get";
import isArray from "lodash/isArray";
import lh from "helpers/linkHandler";
import queryString from "query-string";
import classNames from "classnames";

// const { setProjectFilters } = uiFilterActions;
const { request } = entityStoreActions;
const featuredLimit = 4;
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
    const featuredRequest = request(
      projectsAPI.featured(),
      requests.feProjectsFeatured
    );
    const featuresRequest = request(featuresAPI.index(), requests.feFeatures);
    const { promise: one } = HomeContainer.fetchProjects(dispatch, location);
    const { promise: two } = dispatch(featuredRequest);
    const { promise: three } = dispatch(featuresRequest);
    return Promise.all([one, two, three]);
  };

  static mapStateToProps = state => {
    return {
      features: select(requests.feFeatures, state.entityStore),
      filteredProjects: select(requests.feProjectsFiltered, state.entityStore),
      featuredProjects: select(requests.feProjectsFeatured, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      meta: meta(requests.feProjectsFiltered, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    authentication: PropTypes.object,
    featuredProjects: PropTypes.array,
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

  handleFilterChange = filter => {
    return this.doQuery(filter);
  };

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

  showFeatured() {
    const { featuredProjects } = this.props;
    return featuredProjects && featuredProjects.length > 0;
  }

  renderFeaturedButton(limit) {
    if (
      !this.props.featuredProjects ||
      this.props.featuredProjects.length <= limit
    )
      return null;
    return (
      <div className="button-nav" style={{ marginTop: "26px" }}>
        <Link to={lh.link("frontendFeatured")} className="button-icon-primary">
          <span>
            <i className="manicon manicon-lamp" aria-hidden="true" />
            See all featured
          </span>
        </Link>
      </div>
    );
  }

  renderFeaturedProjects() {
    if (!this.showFeatured()) return null;

    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon manicon-lamp" aria-hidden="true" />
              <div className="body">
                <h4 className="title">{"Featured Projects"}</h4>
              </div>
            </div>
          </header>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            projects={this.props.featuredProjects}
            dispatch={this.props.dispatch}
            limit={featuredLimit}
          />
          {this.renderFeaturedButton(featuredLimit)}
        </div>
      </section>
    );
  }

  renderProjectLibrary() {
    if (this.showPlaceholder()) return <ProjectList.Placeholder />;

    const utilityHeader = classNames({
      utility: true,
      right: this.renderFeaturedProjects()
    });

    const containerClasses = classNames({
      container: true,
      "extra-top": !this.showFeatured()
    });

    return (
      <section className="bg-neutral05">
        <div className={containerClasses}>
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
            <div className={utilityHeader}>
              {/*
                 Note that we're using a different dumb component to render this.
                 Note, too, that the parent component delivers all the data the child
                 component needs to render (which is what keeps the child dumb)'
                 */}
              <ProjectList.Filters
                params={this.currentQuery()}
                updateAction={this.handleFilterChange}
                hideFeatured={!this.showFeatured()}
                subjects={this.props.subjects}
              />
            </div>
          </header>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            dispatch={this.props.dispatch}
            projects={this.props.filteredProjects}
            pagination={get(this.props.meta, "pagination")}
            paginationClickHandler={this.pageChangeHandlerCreator}
            limit={perPage}
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
        {/*
          Note that this section will be used for "Recent Projects"
          once that list is available, this is currently using the
          "featured projects" set of entities instead so as to
          showcase/debug the markup for this type of list.
        */}
        {this.renderFeaturedProjects()}
        {this.renderProjectLibrary()}
        <Layout.ButtonNavigation
          hideAtNarrow
          grayBg={false}
          showBrowse={false}
          showFollowing={!this.showPlaceholder()}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(HomeContainer);
