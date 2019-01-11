import React, { PureComponent } from "react";
import Form from "backend/components/form";

export default class ProjectContentTypeFormMarkdown extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Markdown";

  render() {
    return (
      <React.Fragment>
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
        <Form.TextArea label="Body" name="attributes[body]" wide />
      </React.Fragment>
    );
  }
}
