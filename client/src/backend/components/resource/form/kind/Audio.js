import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindAudio extends PureComponent {
  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {};

  render() {
    return (
      <div className="form-section form-section--primary">
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
