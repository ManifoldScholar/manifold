import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindDocument extends PureComponent {

  static displayName = "Resource.Form.Kind.Document";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        label="Document"
        name="attributes[fake]"
        placeholder="It's a document"
        {...this.props}
      />
    )
  }

}

