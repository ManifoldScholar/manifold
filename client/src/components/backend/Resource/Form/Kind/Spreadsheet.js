import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindSpreadsheet extends PureComponent {

  static displayName = "Resource.Form.Kind.Spreadsheet";

  static propTypes = {
  };

  render() {
    return (
      <Form.Upload
        style="square"
        label="Spreadsheet File"
        accepts="spreadsheet"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

}

