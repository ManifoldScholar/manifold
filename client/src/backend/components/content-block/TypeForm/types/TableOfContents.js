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

  get options() {
    const options = [{ label: "Select Text", value: "" }];

    const texts = this.project.relationships.texts.map(text => {
      return { label: text.attributes.title, value: text };
    });

    return options.concat(texts);
  }

  render() {
    return (
      <React.Fragment>
        <Form.TextInput label="Title" name="attributes[title]" focusOnMount />
        <Form.Select
          label="Text"
          options={this.options}
          name="relationships[text]"
          wide
        />
        <Form.NumberInput label="Depth" name="attributes[depth]" wide />
        <Form.Switch
          label="Show Text Title?"
          name="attributes[showTextTitle]"
          wide
        />
      </React.Fragment>
    );
  }
}
