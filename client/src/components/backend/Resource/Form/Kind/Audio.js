import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class ResourceFormKindAudio extends PureComponent {
  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {};

  render() {
    return (
      <div className="form-section">
        <Form.Upload
          layout="square"
          label="Audio File"
          accepts="audio"
          readFrom="attributes[attachmentFileName]"
          name="attributes[attachment]"
          remove="attributes[removeAttachment]"
          {...this.props}
        />
      </div>
    );
  }
}
