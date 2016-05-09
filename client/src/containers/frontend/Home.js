import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectCovers, ProjectGrid, ProjectFilters } from '../../components/frontend';
import { bindActionCreators } from 'redux';
import { setProjectFilters } from '../../actions/frontend/ui/filters';
import { Link } from 'react-router';
import { request, flush } from '../../actions/shared/entityStore';
import { select } from '../../utils/entityUtils';
import projectsAPI from '../../api/projects';

class HomeContainer extends Component {

  static requests = Object.freeze({
    filteredProjects: 'home-filtered-projects',
    featuredProjects: 'home-featured-projects'
  });

  static fetchData(getState, dispatch) {
    const state = getState();
    const r = HomeContainer.requests; // a little shorter, a little more legible.
    const filteredProjectsCall = projectsAPI.index(state.ui.projectFilters);
    const featuredProjectsCall = projectsAPI.featured();
    const { promise: one } = dispatch(request(filteredProjectsCall, r.filteredProjects));
    const { promise: two } = dispatch(request(featuredProjectsCall, r.featuredProjects));
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    const r = HomeContainer.requests;
    return {
      projectFilters: state.ui.filters.project,
      filteredProjects: select(r.filteredProjects, state.entityStore),
      featuredProjects: select(r.featuredProjects, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    featuredProjects: PropTypes.array,
    filteredProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (prevProps.projectFilters !== this.props.projectFilters) {
      const api = projectsAPI.index(this.props.projectFilters);
      dispatch(request(api, HomeContainer.requests.filteredProjects));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(HomeContainer.requests));
  }

  render() {
    return (
      <div>
        {/*
          Note that this section will be used for "Recent Projects"
          once that list is available, this is currently using the
          "featured projects" set of entities instead so as to
          showcase/debug the markup for this type of list.
        */}
        <section>
          <div className="container">
            <header className="rel">
              <h4 className="section-heading">
                <i className="manicon manicon-new-round"></i>
                {'Recent Projects'}
              </h4>
            </header>
            { this.props.featuredProjects ?
              <ProjectCovers projects={this.props.featuredProjects} /> : null
            }
          </div>
        </section>
        <section className="bg-neutral05">
          <div className="container">
            <header className="rel">
              <h4 className="section-heading">
                <i className="manicon manicon-books-on-shelf"></i>
                {'Filtered Projects'}
              </h4>
            </header>
            {/*
              Note that we're using a different dumb component to render this.
              Note, too, that the parent component delivers all the data the child
              component needs to render (which is what keeps the child dumb)'
            */}
            <ProjectFilters
              updateAction={bindActionCreators(setProjectFilters, this.props.dispatch)}
            />
            { this.props.filteredProjects ?
              <ProjectGrid projects={this.props.filteredProjects} /> : null
            }
          </div>
        </section>
        <section>
          <div className="container">
            <nav className="button-nav">
              <Link to={'/browse/following'}>
                <button className="button-icon-primary">
                  <i className="manicon manicon-books-with-glasses"></i>
                  Projects You're following
                </button>
              </Link>
            </nav>
          </div>
        </section>
      </div>
    );
  }
}

const Home = connect(
  HomeContainer.mapStateToProps
)(HomeContainer);

export default Home;
