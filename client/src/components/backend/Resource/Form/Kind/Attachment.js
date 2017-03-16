import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindAttachment extends PureComponent {

  static displayName = "Resource.Form.Kind.Attachment";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          focusOnMount
          label="An Attachment Field"
          name="attributes[attachmentField]"
          placeholder="A Attachment-Specific Field"
          {...this.props}
        />
        <Form.TextInput
          focusOnMount
          label="Another Attachment Field"
          name="attributes[anotherAttachment]"
          placeholder="Another Attachment-Specific Field"
          {...this.props}
        />
      </div>
    )
  }

}
