import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { ProjectGrid, ProjectSummaryGrid, ProjectFilters } from '../../components/frontend';
import { bindActionCreators } from 'redux';
import { fetchFilteredProjects, fetchFeaturedProjects } from '../../actions/shared/collections';
import { setProjectFilters } from '../../actions/frontend/ui';

class Following extends Component {

  static propTypes = {
    children: PropTypes.object,
    makers: PropTypes.object,
    projects: PropTypes.object,
    featuredProjects: PropTypes.array,
    filteredProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    actions: React.PropTypes.shape({
      fetchFilteredProjects: React.PropTypes.func.isRequired,
      setProjectFilters: React.PropTypes.func.isRequired
    })
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    if (prevProps.projectFilters !== this.props.projectFilters) {
      this.props.actions.fetchFilteredProjects({filter: this.props.projectFilters});
    }
  }

  static fetchData(getState, dispatch) {
    const state = getState();
    return Promise.all([
      dispatch(fetchFilteredProjects({filter: state.ui.projectFilters})),
      dispatch(fetchFeaturedProjects())
    ]);
  }

  render() {
    return (
        <div>
          <section className="neutral20">
            <div className="container">
              <header className="rel">
                <h4 className="section-heading">
                  <i className="manicon manicon-books-with-glasses"></i>
                  {'Projects You\'re Following'}
                </h4>
                <div className="section-heading-utility-right">
                  <ProjectFilters updateAction={this.props.actions.setProjectFilters} />
                </div>
              </header>
              <ProjectGrid makers={this.props.makers}
                           projects={this.props.projects}
                           entities={this.props.filteredProjects}
              />
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
              <ProjectSummaryGrid makers={this.props.makers}
                           projects={this.props.projects}
                           entities={this.props.featuredProjects}
              />
            </div>
          </section>
          <section>
            <div className="container">
              <nav className="button-nav">
                <button className="button-icon-primary">
                  <i className="manicon manicon-books-on-shelf"></i>
                  See more projects
                </button>
                <button className="button-icon-primary">
                  <i className="manicon manicon-books-with-glasses"></i>
                  Projects You're following
                </button>
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
    projectFilters: state.ui.projectFilters,
    projects: state.collections.entities.projects,
    makers: state.collections.entities.makers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({fetchFilteredProjects, setProjectFilters}, dispatch)
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Following);
