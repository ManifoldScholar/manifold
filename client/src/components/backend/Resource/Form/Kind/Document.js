import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class ResourceFormKindDocument extends PureComponent {
  static displayName = "Resource.Form.Kind.Document";

  static propTypes = {};

  render() {
    return (
      <Form.Upload
        layout="square"
        label="Document File"
        accepts="document"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}
