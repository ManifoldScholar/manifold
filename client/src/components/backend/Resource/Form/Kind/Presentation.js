import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindPresentation extends PureComponent {

  static displayName = "Resource.Form.Kind.Presentation";

  static propTypes = {
  };

  render() {
    return (
      <Form.Upload
        style="square"
        label="Presentation File"
        accepts="presentation"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

