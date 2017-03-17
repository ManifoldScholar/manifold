import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindPdf extends PureComponent {

  static displayName = "Resource.Form.Kind.Pdf";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        focusOnMount
        label="Pdf"
        name="attributes[fake]"
        placeholder="It's a PDF"
        {...this.props}
      />
    )
  }

}

