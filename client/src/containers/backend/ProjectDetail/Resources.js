import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Resource from './Resource';

export default class ProjectDetailResourcesContainer extends PureComponent {

  static displayName = "ProjectDetail.ResourcesContainer";

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    editSession: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <section>
        <Resource.ResourcesList
          project={project}
        />
      </section>
    );
  }
}

