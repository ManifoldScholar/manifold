import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormAttachmentTypeAudio extends PureComponent {

  static displayName = "Resource.Form.AttachmentType.Audio";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        focusOnMount
        label="Audio"
        name="attributes[fake]"
        placeholder="It's an audio file"
        {...this.props}
      />
    )
  }

}

