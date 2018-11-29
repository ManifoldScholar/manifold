import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { textsAPI } from "api";

export default class TextGeneralContainer extends PureComponent {
  static displayName = "Text.General";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    return (
      <section>
        <FormContainer.Form
          model={this.props.text}
          name="backend-text-general"
          update={textsAPI.update}
          create={textsAPI.create}
          className="form-secondary"
        >
          <Form.Header label="General" />
          <Form.TextInput
            label="Title"
            name="attributes[title]"
            placeholder="Enter Text Title"
          />
          <Form.Date
            label="Publication Date"
            name="attributes[publicationDate]"
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            placeholder="Enter a Brief Description"
          />
          <Form.TextInput
            label="Section Label"
            name="attributes[sectionKind]"
            placeholder="Enter a label for sections in this text"
            instructions="For example, “chapter” for books or “article” for journals"
          />
          <Form.Save text="Save Text" />
        </FormContainer.Form>
      </section>
    );
  }
}
