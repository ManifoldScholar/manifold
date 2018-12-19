import React, { PureComponent } from "react";
import Form from "backend/components/form";

export default class ProjectContentTypeFormMarkdown extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Markdown";

  // TODO: Needs radio buttons for style, but that component needs to be refactored first.
  render() {
    return (
      <React.Fragment>
        <Form.TextArea
          label="Body"
          name="attributes[body]"
          wide
        />
      </React.Fragment>
    );
  }
}
