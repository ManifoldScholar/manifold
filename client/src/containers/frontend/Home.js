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

  componentWillReceiveProps(nextProps) {
    if (
      this.props.authentication.currentUser !==
      nextProps.authentication.currentUser
    ) {
      this.props.fetchData(nextProps);
    }
    if (nextProps.location !== this.props.location) {
      HomeContainer.fetchProjects(nextProps.dispatch, nextProps.location);
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

  fetchFeaturedProjects = () => {
    const featuredRequest = request(
      projectsAPI.featured(),
      requests.feProjectsFeatured
    );
    this.props.dispatch(featuredRequest);
  };

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
            <i className="manicon manicon-lamp" />See all featured
          </span>
        </Link>
      </div>
    );
  }

  renderFeaturedProjects() {
    if (!this.props.featuredProjects || !this.props.featuredProjects.length > 0)
      return null;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-lamp" />
              {"Featured Projects"}
            </h4>
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

  render() {
    const headerClass = classNames({
      "section-heading": true,
      "utility-right": this.renderFeaturedProjects(),
      "utility-under": !this.renderFeaturedProjects()
    });
    const utilityHeader = classNames({
      "section-heading-utility-right": this.renderFeaturedProjects(),
      "section-heading-utility-under": !this.renderFeaturedProjects()
    });
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
        <section className="bg-neutral05">
          <div className="container">
            <header className={headerClass}>
              <h4 className="title">
                <i className="manicon manicon-books-on-shelf" />
                {"Our Projects"}
              </h4>
              <div className={utilityHeader}>
                {/*
                 Note that we're using a different dumb component to render this.
                 Note, too, that the parent component delivers all the data the child
                 component needs to render (which is what keeps the child dumb)'
                 */}
                <ProjectList.Filters
                  params={this.currentQuery()}
                  updateAction={this.handleFilterChange}
                  subjects={this.props.subjects}
                />
              </div>
            </header>
            {this.props.filteredProjects ? (
              <ProjectList.Grid
                authenticated={this.props.authentication.authenticated}
                favorites={get(
                  this.props.authentication,
                  "currentUser.favorites"
                )}
                dispatch={this.props.dispatch}
                projects={this.props.filteredProjects}
                pagination={get(this.props.meta, "pagination")}
                paginationClickHandler={this.pageChangeHandlerCreator}
                limit={perPage}
              />
            ) : null}
          </div>
        </section>
        <Layout.ButtonNavigation
          hideAtNarrow
          grayBg={false}
          showBrowse={false}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(HomeContainer);
