import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindAudio extends PureComponent {

  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.Upload
          style="square"
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

