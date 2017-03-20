import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindInteractive extends PureComponent {

  static displayName = "Resource.Form.Kind.Interactive";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          label="Interactive"
          name="attributes[fake]"
          placeholder="It's interactive"
        />
      </div>
    );
  }

}

