import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

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
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

}

