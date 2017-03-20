import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindDocument extends PureComponent {

  static displayName = "Resource.Form.Kind.Document";

  static propTypes = {
  };

  render() {
    const existingModel = some(this.props.sourceModel.attributes);
    return (
      <Form.Upload
        style="square"
        label="Document File"
        accepts="document"
        current={existingModel ? this.props.sourceModel.attributes.attachmentFileName : null}
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

