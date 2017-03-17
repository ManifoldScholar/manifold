import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindImage extends PureComponent {

  static displayName = "Resource.Form.Kind.Image";

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
      </div>
    )
  }

}

