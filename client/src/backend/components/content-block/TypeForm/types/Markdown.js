import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ProjectContentTypeFormMarkdown extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Markdown";

  static propTypes = {
    setOther: PropTypes.func.isRequired
  };

  static defaultAttributes = {
    style: "normal"
  };

  render() {
    return (
      <>
        <Form.TextArea
          focusOnMount
          label="Body"
          name="attributes[body]"
          wide
          height={300}
        />
        <Form.Radios
          label="Style"
          name="attributes[style]"
          options={[
            { label: "Normal", value: "normal" },
            { label: "Shaded", value: "shaded" }
          ]}
          inline
          wide
        />
      </>
    );
  }
}
