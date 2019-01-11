import React, { PureComponent } from "react";
import Form from "backend/components/form";
import PropTypes from "prop-types";

export default class ProjectContentTypeFormTableOfContents extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.TableOfContents";

  static propTypes = {
    project: PropTypes.object.isRequired,
    setOther: PropTypes.func.isRequired
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
        <Form.Switch
          label="Show Author Names?"
          name="attributes[showAuthors]"
          wide
        />
      </React.Fragment>
    );
  }
}
