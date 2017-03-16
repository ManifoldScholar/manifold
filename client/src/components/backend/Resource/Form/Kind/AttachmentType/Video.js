import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormAttachmentTypeVideo extends PureComponent {

  static displayName = "Resource.Form.AttachmentType.Video";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        focusOnMount
        label="Video"
        name="attributes[fake]"
        placeholder="It's a video file"
        {...this.props}
      />
    )
  }

}

