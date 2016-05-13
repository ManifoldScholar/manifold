import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { request, requests, flush } from '../../actions/shared/entityStore';
import projectsAPI from '../../api/projects';
import textsAPI from '../../api/texts';
import { select } from '../../utils/entityUtils';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

class DeveloperContainer extends Component {

  static mapStateToProps(state) {
    return {
      texts: select(requests.developerTexts, state.entityStore),
      projects: select(requests.developerProjects, state.entityStore)
    };
  }

  static fetchData(getState, dispatch) {
    const dataRequest = request(projectsAPI.index(), requests.developerProjects);
    const { promise: projects } = dispatch(dataRequest);
    return Promise.all([
      projects
    ]);
  }

  static propTypes = {
    dispatch: PropTypes.func,
    projects: PropTypes.array,
    texts: PropTypes.array
  };

  constructor() {
    super();
  }

  componentDidMount() {
    const textsRequest = request(textsAPI.index(), requests.developerTexts);
    this.props.dispatch(textsRequest);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.developerProjects));
    this.props.dispatch(flush(requests.developerTexts));
  }

  render() {
    return (
      <div>
        <Link to="/browse/">Home</Link>
        <div>
          <h4>Projects</h4>
          <JSONTree data={this.props.projects || {}} />
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
