import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindSpreadsheet extends PureComponent {

  static displayName = "Resource.Form.Kind.Spreadsheet";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        label="Spreadsheet"
        name="attributes[fake]"
        placeholder="It's a spreadsheet"
        {...this.props}
      />
    )
  }

}

