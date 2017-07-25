import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ProjectList, Layout } from "components/frontend";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { bindActionCreators } from "redux";
import { uiFilterActions, entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import classNames from "classnames";

const { setProjectFilters } = uiFilterActions;
const { request } = entityStoreActions;
const featuredLimit = 4;
const page = 1;
const perPage = 20;

export class HomeContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const pageParam = match.params.page ? match.params.page : page;
    const state = getState();
    const filteredRequest = request(
      projectsAPI.index(state.ui.projectFilters, {
        number: pageParam,
        size: perPage
      }),
      requests.feProjectsFiltered
    );
    const featuredRequest = request(
      projectsAPI.featured(),
      requests.feProjectsFeatured
    );
    const { promise: one } = dispatch(filteredRequest);
    const { promise: two } = dispatch(featuredRequest);
    return Promise.all([one, two]);
  };

  static mapStateToProps = state => {
    return {
      projectFilters: state.ui.filters.project,
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
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func,
    subjects: PropTypes.array,
    meta: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (prevProps.projectFilters !== this.props.projectFilters) {
      const apiCall = projectsAPI.index(this.props.projectFilters);
      const filteredRequest = request(apiCall, requests.feProjectsFiltered);
      dispatch(filteredRequest);
    }
  }

  handlePageChange(event, pageParam) {
    event.preventDefault(); // Remove this to scroll back to top.  Will add #pagination-target to URL
    const pagination = { number: pageParam, size: perPage };
    const filter = this.props.projectFilters;
    const action = request(
      projectsAPI.index(filter, pagination),
      requests.feProjectsFiltered
    );
    this.props.dispatch(action);
  }

  pageChangeHandlerCreator(pageParam) {
    return event => {
      this.handlePageChange(event, pageParam);
    };
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
    return (
      <div
        style={{
          overflowX: "hidden"
        }}
      >
        <Layout.Splash
          authenticated={this.props.authentication.authenticated}
          toggleSignInUpOverlay={this.commonActions.toggleSignInUpOverlay}
        />
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
                  updateAction={bindActionCreators(
                    setProjectFilters,
                    this.props.dispatch
                  )}
                  subjects={this.props.subjects}
                />
              </div>
            </header>
            {this.props.filteredProjects
              ? <ProjectList.Grid
                  authenticated={this.props.authentication.authenticated}
                  favorites={get(
                    this.props.authentication,
                    "currentUser.favorites"
                  )}
                  dispatch={this.props.dispatch}
                  projects={this.props.filteredProjects}
                  pagination={this.props.meta.pagination}
                  paginationClickHandler={this.pageChangeHandlerCreator}
                  limit={perPage}
                />
              : null}
          </div>
        </section>
        <Layout.ButtonNavigation
          grayBg={false}
          showBrowse={false}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(HomeContainer);
