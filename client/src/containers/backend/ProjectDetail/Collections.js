import React, { PureComponent, PropTypes } from 'react';
import Resource from './Resource';

export default class ProjectDetailCollectionsContainer extends PureComponent {

  static displayName = "ProjectDetail.CollectionsContainer";

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
        <Resource.CollectionsList
          project={project}
        />
      </section>
    );
  }
}

