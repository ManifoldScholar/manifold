import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindDocument extends PureComponent {

  static displayName = "Resource.Form.Kind.Document";

  static propTypes = {
  };

  render() {
    return (
      <Form.Upload
        style="square"
        label="Document File"
        accepts="document"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

