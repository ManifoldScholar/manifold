import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormAttachmentTypeFile extends PureComponent {

  static displayName = "Resource.Form.AttachmentType.File";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        focusOnMount
        label="File"
        name="attributes[fake]"
        placeholder="It's a file"
        {...this.props}
      />
    )
  }

}

