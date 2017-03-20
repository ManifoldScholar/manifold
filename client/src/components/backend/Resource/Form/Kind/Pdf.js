import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindPdf extends PureComponent {

  static displayName = "Resource.Form.Kind.Pdf";

  static propTypes = {
  };

  render() {
    return (
      <Form.Upload
        style="square"
        label="PDF File"
        accepts="pdf"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

