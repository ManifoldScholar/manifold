import React, { PureComponent } from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";

export default class ProjectContentTypeFormTableOfContents extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.TableOfContents";

  static propTypes = {
    project: PropTypes.object.isRequired,
    setOther: PropTypes.func.isRequired
  };

  static defaultAttributes = {
    depth: 6
  };

  get project() {
    return this.props.project;
  }

  render() {
    return (
      <>
        <Form.TextInput label="Title" name="attributes[title]" focusOnMount />
        <Form.Picker
          label="Text"
          options={this.project.relationships.texts}
          optionToLabel={t => t.attributes.title}
          placeholder="Select a text"
          name="relationships[text]"
          wide
        />
        <Form.NumberInput label="Depth" name="attributes[depth]" wide />
        <Form.Switch
          label="Show Text Title?"
          name="attributes[showTextTitle]"
          wide
        />
      </>
    );
  }
}
