import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectCovers, ProjectGrid, ProjectFilters } from '../../components/frontend';
import { bindActionCreators } from 'redux';
import { fetchFilteredProjects, fetchFeaturedProjects } from '../../actions/shared/collections';
import { setProjectFilters } from '../../actions/frontend/ui/filters';
import { Link } from 'react-router';

class HomeContainer extends Component {

  static fetchData(getState, dispatch) {
    const state = getState();
    return Promise.all([
      fetchFilteredProjects(state.ui.projectFilters)(dispatch, getState),
      fetchFeaturedProjects()(dispatch, getState)
    ]);
  }

  static propTypes = {
    children: PropTypes.object,
    makers: PropTypes.object,
    projects: PropTypes.object,
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
      dispatch(fetchFilteredProjects(this.props.projectFilters));
    }
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
            <ProjectCovers
              makers={this.props.makers}
              projects={this.props.projects}
              entities={this.props.featuredProjects}
            />
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
              Note, too, that the parent component delivers all the data the child component needs
              to render (which is what keeps the child dumb)'
            */}
            <ProjectFilters
              updateAction={bindActionCreators(setProjectFilters, this.props.dispatch)}
            />
            <ProjectGrid
              makers={this.props.makers}
              projects={this.props.projects}
              entities={this.props.filteredProjects}
            />
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

function mapStateToProps(state) {
  return {
    filteredProjects: state.collections.results.fetchFilteredProjects.entities,
    featuredProjects: state.collections.results.fetchFeaturedProjects.entities,
    projectFilters: state.ui.filters.project,
    projects: state.collections.entities.projects,
    makers: state.collections.entities.makers
  };
}


const Home = connect(
  mapStateToProps
)(HomeContainer);

export default Home;
