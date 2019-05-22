import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Link } from "react-router-dom";
import Layout from "frontend/components/layout";
import ProjectList from "frontend/components/project-list";
import { bindActionCreators } from "redux";
import { uiFilterActions, entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, favoriteProjectsAPI, requests } from "api";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import size from "lodash/size";
import HeadContent from "global/components/HeadContent";
import Utility from "global/components/utility";

import Authorize from "hoc/authorize";

const { setProjectFilters } = uiFilterActions;
const { request } = entityStoreActions;
const featuredLimit = 4;

export class FollowingContainer extends Component {
  static fetchData = (getState, dispatch) => {
    const state = getState();
    if (state.authentication.authenticated) {
      const followedProjectsRequest = request(
        favoriteProjectsAPI.index(state.ui.transitory.projectFilters),
        requests.feProjectsFollowed
      );
      const featuredRequest = request(
        projectsAPI.featured(),
        requests.feProjectsFeatured
      );
      const { promise: one } = dispatch(followedProjectsRequest);
      const { promise: two } = dispatch(featuredRequest);
      return Promise.all([one, two]);
    }
    return Promise.all([]);
  };

  static mapStateToProps = state => {
    return {
      projectFilters: state.ui.transitory.filters.project,
      followedProjects: select(requests.feProjectsFollowed, state.entityStore),
      featuredProjects: select(requests.feProjectsFeatured, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    featuredProjects: PropTypes.array,
    followedProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.object,
    subjects: PropTypes.array
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    featuredProjects: [],
    followedProjects: []
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.authentication.authenticated) return;
    // Favorite projects filters changed?
    if (prevProps.projectFilters !== this.props.projectFilters) {
      this.updateFavorites();
    }
    // Favorites changed?
    if (
      prevProps.authentication.currentUser.favorites !==
      this.props.authentication.currentUser.favorites
    ) {
      this.updateFavorites();
    }
  }

  updateFavorites() {
    const apiCall = favoriteProjectsAPI.index(this.props.projectFilters);
    const followedRequest = request(apiCall, requests.feProjectsFollowed);
    const { promise } = this.props.dispatch(followedRequest);
    promise.then(res => {
      const { favorites } = this.props.authentication.currentUser;
      if (
        res.data &&
        res.data.length === 0 &&
        favorites &&
        size(favorites) > 0
      ) {
        this.props.dispatch(setProjectFilters({}));
      }
    });
  }

  renderFeaturedButton(limit) {
    if (
      !this.props.featuredProjects ||
      this.props.featuredProjects.length <= limit
    )
      return null;
    return (
      <div className="utility right">
        <Link to={lh.link("frontendFeatured")} className="button-primary">
          <span className="button-primary__text">See all featured</span>
        </Link>
      </div>
    );
  }

  renderFeaturedProjects() {
    if (!this.props.featuredProjects || !this.props.featuredProjects.length > 0)
      return null;

    return (
      <section>
        <div className="entity-section-wrapper container">
          <header className="entity-section-wrapper__heading section-heading">
            <div className="main">
              <Utility.IconComposer size={56} icon="lamp64" />
              <div className="body">
                <h2 className="title">{"Featured Projects"}</h2>
              </div>
            </div>
            {this.renderFeaturedButton(featuredLimit)}
          </header>
          {this.props.featuredProjects ? (
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={get(
                this.props.authentication,
                "currentUser.favorites"
              )}
              dispatch={this.props.dispatch}
              projects={this.props.featuredProjects}
              limit={featuredLimit}
            />
          ) : null}
        </div>
      </section>
    );
  }

  render() {
    const boundSetFilters = bindActionCreators(
      setProjectFilters,
      this.props.dispatch
    );

    return (
      <Authorize
        kind="any"
        failureRedirect={lh.link("frontend")}
        {...this.props}
      >
        <div>
          <HeadContent title="Following" appendTitle />
          <h1 className="screen-reader-text">Projects You’re Following</h1>
          <ProjectList.Following
            followedProjects={this.props.followedProjects}
            authentication={this.props.authentication}
            subjects={this.props.subjects}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            filterChangeHandler={boundSetFilters}
            dispatch={this.props.dispatch}
          />
          {this.renderFeaturedProjects()}
          {this.props.followedProjects &&
          this.props.followedProjects.length > 0 ? (
            <Layout.ButtonNavigation
              hideAtNarrow
              grayBg
              showFollowing={false}
            />
          ) : null}
        </div>
      </Authorize>
    );
  }
}

export default connectAndFetch(FollowingContainer);
