import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ProjectList, Layout } from 'components/frontend';
import connectAndFetch from 'utils/connectAndFetch';
import { commonActions } from 'actions/helpers';
import { bindActionCreators } from 'redux';
import { uiFilterActions, entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { projectsAPI, requests } from 'api';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';

const { setProjectFilters } = uiFilterActions;
const { request } = entityStoreActions;
const featuredLimit = 4;

export class HomeContainer extends Component {

  static fetchData(getState, dispatch) {
    const state = getState();
    const filteredRequest =
      request(projectsAPI.index(state.ui.projectFilters), requests.feProjectsFiltered);
    const featuredRequest =
      request(projectsAPI.featured(), requests.feProjectsFeatured);
    const { promise: one } = dispatch(filteredRequest);
    const { promise: two } = dispatch(featuredRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      projectFilters: state.ui.filters.project,
      filteredProjects: select(requests.feProjectsFiltered, state.entityStore),
      featuredProjects: select(requests.feProjectsFeatured, state.entityStore),
      subjects: select(requests.feSubjects, state.entityStore),
      authentication: state.authentication
    };
  }

  static propTypes = {
    authentication: PropTypes.object,
    children: PropTypes.object,
    featuredProjects: PropTypes.array,
    filteredProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func,
    subjects: PropTypes.array
  };

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
      const filteredRequest =
        request(apiCall, requests.feProjectsFiltered);
      dispatch(filteredRequest);
    }
  }

  renderFeaturedButton(limit) {
    if (!this.props.featuredProjects || this.props.featuredProjects.length <= limit) return null;
    return (
      <div className="button-nav" style={{ marginTop: '26px' }}>
        <Link
          to={lh.link("frontendFeatured")}
          className="button-icon-primary"
        >
          <span>
            <i className="manicon manicon-lamp"></i>See all featured
          </span>
        </Link>
      </div>
    );
  }

  render() {
    return (
      <div style={ {
        overflowX: 'hidden'
      } }>
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
        <section>
          <div className="container">
            <header className="section-heading">
              <h4 className="title">
                <i className="manicon manicon-lamp"></i>
                {'Featured Projects'}
              </h4>
            </header>
            { this.props.featuredProjects ?
              <ProjectList.Grid
                authenticated={this.props.authentication.authenticated}
                favorites={get(this.props.authentication, 'currentUser.favorites')}
                projects={this.props.featuredProjects}
                dispatch={this.props.dispatch}
                limit={featuredLimit}
              /> : null
            }
            {this.renderFeaturedButton(featuredLimit)}
          </div>
        </section>
        <section className="bg-neutral05">
          <div className="container">
            <header className="section-heading utility-right">
              <h4 className="title">
                <i className="manicon manicon-books-on-shelf"></i>
                {'Our Projects'}
              </h4>
              <div className="section-heading-utility-right">
                {/*
                 Note that we're using a different dumb component to render this.
                 Note, too, that the parent component delivers all the data the child
                 component needs to render (which is what keeps the child dumb)'
                 */}
                <ProjectList.Filters
                  updateAction={bindActionCreators(setProjectFilters, this.props.dispatch)}
                  subjects={this.props.subjects}
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
