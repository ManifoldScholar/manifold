import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/backend';
import { Metadata } from 'components/backend';
import { projectsAPI } from 'api';

export default class ProjectDetailMetadata extends PureComponent {

  static displayName = "ProjectDetail.Metadata";

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
    return (
      <Metadata.Form
        model={this.props.project}
        name="backend-project-general"
        update={projectsAPI.update}
        create={projectsAPI.create}
        className="form-secondary"
      />
    );
  }
}

