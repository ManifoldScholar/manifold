import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class ResourceFormKindPdf extends PureComponent {
  static displayName = "Resource.Form.Kind.Pdf";

  static propTypes = {};

  render() {
    return (
      <Form.Upload
        layout="square"
        label="PDF File"
        accepts="pdf"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}
