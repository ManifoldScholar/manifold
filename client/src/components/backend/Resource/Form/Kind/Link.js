import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindLink extends PureComponent {

  static displayName = "Resource.Form.Kind.Link";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          focusOnMount
          label="A Link Field"
          name="attributes[linkField]"
          placeholder="A Link-Specific Field"
          {...this.props}
        />
        <Form.TextInput
          focusOnMount
          label="Another Link Field"
          name="attributes[anotherLinkField]"
          placeholder="Another Link-Specific Field"
          {...this.props}
        />
      </div>
    )
  }

}
