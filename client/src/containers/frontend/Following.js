import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ProjectList } from 'components/frontend';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { uiFilterActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import projectsAPI from 'api/projects';
import get from 'lodash/get';

const { select } = entityUtils;
const { setProjectFilters } = uiFilterActions;
const { request, requests } = entityStoreActions;

class FollowingContainer extends Component {

  static fetchData(getState, dispatch) {
    const state = getState();
    const filteredRequest =
      request(projectsAPI.index(state.ui.projectFilters), requests.browseFilteredProjects);
    const featuredRequest =
      request(projectsAPI.featured(), requests.browseFeaturedProjects);
    const { promise: one } = dispatch(filteredRequest);
    const { promise: two } = dispatch(featuredRequest);
    return Promise.all([one, two]);
  }

  static propTypes = {
    children: PropTypes.object,
    featuredProjects: PropTypes.array,
    filteredProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static mapStateToProps(state) {
    return {
      projectFilters: state.ui.filters.project,
      filteredProjects: select(requests.browseFilteredProjects, state.entityStore),
      featuredProjects: select(requests.browseFeaturedProjects, state.entityStore),
      authentication: state.authentication
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (prevProps.projectFilters !== this.props.projectFilters) {
      const apiCall = projectsAPI.index(this.props.projectFilters);
      const filteredRequest =
        request(apiCall, requests.browseFilteredProjects);
      dispatch(filteredRequest);
    }
  }

  render = () => {
    const boundSetFilters = bindActionCreators(setProjectFilters, this.props.dispatch);
    return (
      <div>
        <section className="bg-neutral05">
          <div className="container">
            <header className="section-heading utility-right">
              <h4 className="title">
                <i className="manicon manicon-books-with-glasses"></i>
                {'Projects You\'re Following'}
              </h4>
              <div className="section-heading-utility-right">
                <ProjectList.Filters
                  updateAction={boundSetFilters}
                />
              </div>
            </header>
            { this.props.filteredProjects ?
              <ProjectList.Grid
                authenticated={this.props.authentication.authenticated}
                favorites={get(this.props.authentication, 'currentUser.favorites')}
                dispatch={this.props.dispatch}
                projects={this.props.filteredProjects}
              /> : null
            }
          </div>
        </section>
        <section>
          <div className="container">
            <header className="section-heading utility-right">
              <h4 className="title">
                <i className="manicon manicon-lamp"></i>
                {'Featured Projects'}
              </h4>
              <div className="section-heading-utility-right">
                <Link to={`/browse/`} className="button-primary">
                  See all Featured
                </Link>
              </div>
            </header>
            { this.props.featuredProjects ?
              <ProjectList.SummaryGrid
                authenticated={this.props.authentication.authenticated}
                favorites={get(this.props.authentication, 'currentUser.favorites')}
                dispatch={this.props.dispatch}
                projects={this.props.featuredProjects}
              /> : null
            }
          </div>
        </section>
        <section>
          <div className="container">
            <nav className="button-nav">
              <Link to={'/browse'} >
                <button className="button-icon-primary">
                  <i className="manicon manicon-books-on-shelf"></i>
                  See more projects
                </button>
              </Link>
            </nav>
          </div>
        </section>
      </div>
    );
  };
}

const Following = connect(
  FollowingContainer.mapStateToProps
)(FollowingContainer);

export default Following;
