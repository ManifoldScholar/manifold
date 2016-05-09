import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { request, flush } from '../../actions/shared/entityStore';
import projectsAPI from '../../api/projects';
import textsAPI from '../../api/texts';
import { select } from '../../utils/entityUtils';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

class DeveloperContainer extends Component {

  static requests = Object.freeze({
    featured: 'developer-container-featured-projects',
    projects: 'developer-container-projects',
    project: 'developer-container-project',
    texts: 'developer-container-texts'
  });

  static mapStateToProps(state) {
    const r = DeveloperContainer.requests;
    return {
      texts: select(r.texts, state.entityStore),
      project: select(r.project, state.entityStore),
      projects: select(r.projects, state.entityStore),
      featured: select(r.featured, state.entityStore)
    };
  }

  static fetchData(getState, dispatch) {
    const r = DeveloperContainer.requests;
    const { promise: projects } = dispatch(request(projectsAPI.index(), r.projects));
    return Promise.all([
      projects
    ]);
  }

  static propTypes = {
    dispatch: PropTypes.func,
    projects: PropTypes.array,
    project: PropTypes.object,
    featured: PropTypes.array,
    texts: PropTypes.array
  };

  constructor() {
    super();
  }

  componentDidMount() {
    const r = DeveloperContainer.requests;
    this.props.dispatch(request(projectsAPI.featured(3), r.featured));
    this.props.dispatch(request(projectsAPI.show(1), r.project));
    this.props.dispatch(request(textsAPI.index(), r.texts));
  }

  componentWillUnmount() {
    this.props.dispatch(flush(DeveloperContainer.requests));
  }

  render() {
    return (
      <div>
        <Link to="/browse/">Home</Link>
        <div>
          <h4>Project</h4>
          <JSONTree data={this.props.project || {}} />
        </div>
        <div>
          <h4>Projects</h4>
          <JSONTree data={this.props.projects || {}} />
        </div>
        <div>
          <h4>Featured</h4>
          <JSONTree data={this.props.featured || {}} />
        </div>
        <div>
          <h4>Texts</h4>
          <JSONTree data={this.props.texts || {}} />
        </div>
      </div>
    );
  }
}

const Developer = connect(
  DeveloperContainer.mapStateToProps
)(DeveloperContainer);

export default Developer;
