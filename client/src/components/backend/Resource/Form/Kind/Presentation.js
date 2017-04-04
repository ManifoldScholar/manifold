import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

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
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

}

