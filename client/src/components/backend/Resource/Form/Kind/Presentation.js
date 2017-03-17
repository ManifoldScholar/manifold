import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindPresentation extends PureComponent {

  static displayName = "Resource.Form.Kind.Presentation";

  static propTypes = {
  };

  render() {
    return (
      <Form.TextInput
        focusOnMount
        label="Presentation"
        name="attributes[fake]"
        placeholder="It's a presentation"
        {...this.props}
      />
    )
  }

}

