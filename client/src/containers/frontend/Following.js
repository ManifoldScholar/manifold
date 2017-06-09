import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Link } from 'react-router-dom';
import { ProjectList, Layout } from 'components/frontend';
import { bindActionCreators } from 'redux';
import { uiFilterActions, entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { projectsAPI, favoriteProjectsAPI, requests } from 'api';
import HigherOrder from 'containers/global/HigherOrder';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';

const { setProjectFilters } = uiFilterActions;
const { request } = entityStoreActions;
const featuredLimit = 4;

export class FollowingContainer extends Component {

  static fetchData(getState, dispatch) {
    const state = getState();
    if (state.authentication.authenticated) {
      const followedProjectsRequest =
        request(favoriteProjectsAPI.index(state.ui.projectFilters), requests.feProjectsFollowed);
      const featuredRequest =
        request(projectsAPI.featured(), requests.feProjectsFeatured);
      const { promise: one } = dispatch(followedProjectsRequest);
      const { promise: two } = dispatch(featuredRequest);
      return Promise.all([one, two]);
    }
    return Promise.all([]);
  }

  static propTypes = {
    children: PropTypes.object,
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

  static mapStateToProps(state) {
    return {
      projectFilters: state.ui.filters.project,
      followedProjects: select(requests.feProjectsFollowed, state.entityStore),
      featuredProjects: select(requests.feProjectsFeatured, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      authentication: state.authentication
    };
  }

  constructor() {
    super();
  }

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
    if (prevProps.authentication.currentUser.favorites !==
      this.props.authentication.currentUser.favorites) {
      this.updateFavorites();
    }
  }

  updateFavorites() {
    const apiCall = favoriteProjectsAPI.index(this.props.projectFilters);
    const followedRequest = request(apiCall, requests.feProjectsFollowed);
    const { promise } = this.props.dispatch(followedRequest);
    promise.then((res) => {
      const { favorites } = this.props.authentication.currentUser;
      if (res.data && res.data.length === 0 && favorites && size(favorites) > 0) {
        this.props.dispatch(setProjectFilters({}));
      }
    });
  }

  renderFeaturedButton(limit) {
    if (!this.props.featuredProjects || this.props.featuredProjects.length <= limit) return null;
    return (
      <div className="section-heading-utility-right">
        <Link
          to={lh.link("frontendFeatured")}
          className="button-primary"
        >
          <span>
            <i className="manicon manicon-lamp"></i>See all featured
          </span>
        </Link>
      </div>
    );
  }

  render() {
    const boundSetFilters = bindActionCreators(setProjectFilters, this.props.dispatch);

    return (
      <HigherOrder.RequireRole requiredRole="any" redirect={lh.link("frontend")} {...this.props}>
        <div>
          <ProjectList.Following
            followedProjects={this.props.followedProjects}
            authentication={this.props.authentication}
            subjects={this.props.subjects}
            favorites={get(this.props.authentication, 'currentUser.favorites')}
            handleUpdate={boundSetFilters}
          />
          <section>
            <div className="container">
              <header className="section-heading utility-right">
                <h4 className="title">
                  <i className="manicon manicon-lamp"></i>
                  {'Featured Projects'}
                </h4>
                {this.renderFeaturedButton(featuredLimit)}
              </header>
              { this.props.featuredProjects ?
                <ProjectList.Grid
                  authenticated={this.props.authentication.authenticated}
                  favorites={get(this.props.authentication, 'currentUser.favorites')}
                  dispatch={this.props.dispatch}
                  projects={this.props.featuredProjects}
                  limit={featuredLimit}
                /> : null
              }
            </div>
          </section>
          <Layout.ButtonNavigation grayBg showFollowing={false} />
        </div>
      </HigherOrder.RequireRole>
    );
  }
}

export default connectAndFetch(FollowingContainer);
