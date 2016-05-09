import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ProjectGrid, ProjectSummaryGrid, ProjectFilters } from '../../components/frontend';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setProjectFilters } from '../../actions/frontend/ui/filters';
import { request, flush } from '../../actions/shared/entityStore';
import { select } from '../../utils/entityUtils';
import projectsAPI from '../../api/projects';

class FollowingContainer extends Component {

  static requests = Object.freeze({
    filteredProjects: 'following-filtered-projects',
    featuredProjects: 'following-featured-projects'
  });

  static fetchData(getState, dispatch) {
    const state = getState();
    const r = FollowingContainer.requests; // a little shorter, a little more legible.
    const filteredProjectsCall = projectsAPI.index(state.ui.projectFilters);
    const featuredProjectsCall = projectsAPI.featured();
    const { promise: one } = dispatch(request(filteredProjectsCall, r.filteredProjects));
    const { promise: two } = dispatch(request(featuredProjectsCall, r.featuredProjects));
    return Promise.all([one, two]);
  }

  static propTypes = {
    children: PropTypes.object,
    featuredProjects: PropTypes.array,
    filteredProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static mapStateToProps(state) {
    const r = FollowingContainer.requests;
    return {
      projectFilters: state.ui.filters.project,
      filteredProjects: select(r.filteredProjects, state.entityStore),
      featuredProjects: select(r.featuredProjects, state.entityStore),
      authentication: state.authentication
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (prevProps.projectFilters !== this.props.projectFilters) {
      const api = projectsAPI.index(this.props.projectFilters);
      dispatch(request(api, FollowingContainer.requests.filteredProjects));
    }
  }

  render = () => {
    const boundSetFilters = bindActionCreators(setProjectFilters, this.props.dispatch);
    return (
      <div>
        <section className="bg-neutral05">
          <div className="container">
            <header className="rel">
              <h4 className="section-heading">
                <i className="manicon manicon-books-with-glasses"></i>
                {'Projects You\'re Following'}
              </h4>
              <div className="section-heading-utility-right">
                <ProjectFilters
                  updateAction={boundSetFilters}
                />
              </div>
            </header>
            { this.props.filteredProjects ?
              <ProjectGrid projects={this.props.filteredProjects} /> : null
            }
          </div>
        </section>
        <section>
          <div className="container">
            <header className="rel">
              <h4 className="section-heading">
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
              <ProjectSummaryGrid projects={this.props.featuredProjects} /> : null
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
