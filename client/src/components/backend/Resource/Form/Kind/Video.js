import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindVideo extends PureComponent {

  static displayName = "Resource.Form.Kind.Video";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          focusOnMount
          label="A Video Field"
          name="attributes[videoField]"
          placeholder="A Video-Specific Field"
          {...this.props}
        />
        <Form.TextInput
          focusOnMount
          label="Another Video Field"
          name="attributes[anotherVideoField]"
          placeholder="Another Video-Specific Field"
          {...this.props}
        />
      </div>
    )
  }

}
