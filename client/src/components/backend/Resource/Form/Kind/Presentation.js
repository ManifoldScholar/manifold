import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class ResourceFormKindPresentation extends PureComponent {
  static displayName = "Resource.Form.Kind.Presentation";

  static propTypes = {};

  render() {
    return (
      <Form.Upload
        layout="square"
        label="Presentation File"
        accepts="presentation"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}
