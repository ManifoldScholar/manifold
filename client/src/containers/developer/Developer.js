import React, { Component } from 'react';
import { fetchFeaturedProjects } from '../../actions/shared/collections';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class DeveloperContainer extends Component {

  static fetchData(getState, dispatch) {
    return Promise.all([
      fetchFeaturedProjects()(dispatch, getState)
    ]);
  }

  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      test: Math.random()
    };
  }

  render() {
    return (
      <div>
        <Link to={`/browse/following/`}>
          {'Following'}
        </Link>
        <div>{'state:'} {this.state.test}</div>
        <div>{'ggggg'}</div>
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

const Developer = connect(
  mapStateToProps
)(DeveloperContainer);

export default Developer;
