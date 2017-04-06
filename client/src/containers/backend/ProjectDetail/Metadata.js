import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import update from 'immutability-helper';
import set from 'lodash/set';
import { projectsAPI } from 'api';

export default class ProjectDetailMetadata extends PureComponent {

  static displayName = "ProjectDetail.Metadata";
  static activeNavItem = "metadata";

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


    // See https://github.com/ReactTraining/react-router/issues/3753
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.project}
          name="backend-project-general"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="ISBN-10"
            name="attributes[metadata][isbnTen]"
            placeholder="Enter ISBN-10 Number"
          />
          <Form.TextInput
            focusOnMount
            label="ISBN-13"
            name="attributes[metadata][isbnThirteen]"
            placeholder="Enter ISBN-13 Number"
          />
          <Form.TextInput
            label="Publisher"
            name="attributes[metadata][publisher]"
            placeholder="Enter Publisher Name"
          />
          <Form.TextInput
            label="Place of Publication"
            name="attributes[metadata][placeOfPublication]"
            placeholder="Enter Place of Publication"
          />
          <Form.TextInput
            label="Digital Object Identifier (DOI)"
            name="attributes[metadata][doi]"
            placeholder="Enter DOI"
          />
          <Form.TextInput
            label="Series"
            name="attributes[metadata][series]"
            placeholder="Enter Series Name"
          />
          <Form.Save
            text="Save Metadata"
          />
        </FormContainer.Form>
      </section>
    );
  }
}
