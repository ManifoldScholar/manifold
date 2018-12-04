import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";

export default class ResourceFormKindImage extends PureComponent {
  static displayName = "Resource.Form.Kind.Image";

  static propTypes = {};

  render() {
    return (
      <Form.Upload
        layout="square"
        label="Image File"
        accepts="images"
        readFrom="attributes[attachmentStyles][small]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}
