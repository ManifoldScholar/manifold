import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindImage extends PureComponent {

  static displayName = "Resource.Form.Kind.Image";

  static propTypes = {
  };

  render() {
    return (
      <Form.Upload
        style="square"
        label="Image File"
        accepts="images"
        readFrom="attributes[attachmentStyles][smallSquare]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

}

