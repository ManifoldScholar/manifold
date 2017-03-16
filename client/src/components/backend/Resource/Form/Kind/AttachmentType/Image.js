import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormAttachmentTypeImage extends PureComponent {

  static displayName = "Resource.Form.AttachmentType.Image";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          focusOnMount
          label="Image"
          name="attributes[fake]"
          placeholder="It's an image file"
        />
        <Form.Upload
          style="square"
          label="Hi-Resolution Version"
          accepts="image"
          current={this.props.sourceModel.attributes.attachmentName}
          name="attributes[highRes]"
          remove="attributes[removeHighRes]"
        />
      </div>
    )
  }

}

