import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { projectsAPI, textsAPI } from 'api';
import { entityUtils } from 'utils';
import JSONTree from 'react-json-tree';
import { Link } from 'react-router';

const { request, requests, flush } = entityStoreActions;
const { select } = entityUtils;

class DeveloperContainer extends Component {

  static mapStateToProps(state) {
    return { state };
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
        <JSONTree data={this.props.state || {}} />
      </div>
    );
  }
}

const Developer = connect(
  DeveloperContainer.mapStateToProps
)(DeveloperContainer);

export default Developer;
