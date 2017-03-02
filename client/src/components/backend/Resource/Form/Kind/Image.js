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
          label="An Image Field"
          name="attributes[imageField]"
          placeholder="A Image-Specific Field"
          {...this.props}
        />
        <Form.TextInput
          focusOnMount
          label="Another Image Field"
          name="attributes[anotherImageField]"
          placeholder="Another Image-Specific Field"
          {...this.props}
        />
      </div>
    )
  }

}
