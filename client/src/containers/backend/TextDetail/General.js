import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { textsAPI } from 'api';

export default class TextDetailGeneralContainer extends PureComponent {

  static displayName = "TextDetail.General";

  static propTypes = {
    route: PropTypes.object,
    text: PropTypes.object,
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
          model={this.props.text}
          name="backend-text-general"
          update={textsAPI.update}
          create={textsAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            label="Title"
            name="attributes[title]"
            placeholder="Enter Text Title"
          />
          <Form.TextInput
            label="Unique Identifier"
            name="attributes[uniqueIdentifier]"
            placeholder="Enter the Unique Identifier"
          />
          <Form.TextInput
            label="Language"
            name="attributes[language]"
            placeholder="Enter the Language"
          />
          <Form.TextArea
            label="Rights"
            name="attributes[rights]"
            placeholder="Enter Text Rights"
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            placeholder="Enter a Brief Description"
          />
          <Form.Save text="Save Text" />
        </FormContainer.Form>
      </section>
    );
  }
}
