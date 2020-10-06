import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
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
          <Form.FieldGroup label="General">
            <Form.TextInput
              wide
              label="Title"
              name="attributes[title]"
              placeholder="Enter Text Title"
            />
            <Form.TextInput
              wide
              label="Subtitle"
              name="attributes[subtitle]"
              placeholder="Enter Subtitle"
            />
            <Form.DatePicker
              label="Publication Date"
              name="attributes[publicationDate]"
            />
            <Form.TextInput
              wide
              label="Slug"
              name="attributes[pendingSlug]"
              placeholder="Enter Text Slug"
            />
            <Form.TextArea
              wide
              label="Description"
              name="attributes[description]"
              placeholder="Enter a Brief Description"
            />
            <Form.Upload
              wide
              layout="portrait"
              label="Cover"
              accepts="images"
              readFrom="attributes[coverStyles][small]"
              name="attributes[cover]"
              remove="attributes[removeCover]"
            />
          </Form.FieldGroup>
          <Form.FieldGroup label="Presentation">
            <Form.Switch
              wide
              className="form-toggle-secondary"
              instructions={`When on, a "published" badge will appear next to the text in lists of texts.`}
              label="Published?"
              name="attributes[published]"
            />
            <Form.TextInput
              wide
              label="Section Label"
              name="attributes[sectionKind]"
              placeholder="Section"
              instructions="For example, “chapter” for books or “article” for journals"
            />
          </Form.FieldGroup>
          <Form.FieldGroup label="Access">
            <Form.Switch
              wide
              className="form-toggle-secondary"
              label="Ignore Access Restrictions?"
              name="attributes[ignoreAccessRestrictions]"
            />
          </Form.FieldGroup>
          <Form.Save text="Save Text" />
        </FormContainer.Form>
      </section>
    );
  }
}
