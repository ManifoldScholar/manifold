import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import update from 'immutability-helper';
import set from 'lodash/set';
import { textsAPI } from 'api';

export default class TextDetailMetadata extends PureComponent {

  static displayName = "TextDetail.Metadata";
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
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.text}
          name="backend-project-general"
          update={textsAPI.update}
          create={textsAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            label="ISBN"
            name="attributes[metadata][isbn]"
            placeholder="Enter ISBN Number"
          />
          <Form.TextInput
            label="Publisher"
            name="attributes[metadata][publisher]"
            placeholder="Enter Publisher Name"
          />
          <Form.TextInput
            label="Publisher"
            name="attributes[metadata][placeOfPublication]"
            placeholder="Enter Place of Publication"
          />
          <Form.Date
            label="Publication Date"
            name="attributes[publicationDate]"
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
