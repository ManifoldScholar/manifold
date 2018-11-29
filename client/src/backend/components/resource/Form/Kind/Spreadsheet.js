import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class ResourceFormKindSpreadsheet extends PureComponent {
  static displayName = "Resource.Form.Kind.Spreadsheet";

  static propTypes = {};

  render() {
    return (
      <Form.Upload
        layout="square"
        label="Spreadsheet File"
        accepts="spreadsheet"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}
