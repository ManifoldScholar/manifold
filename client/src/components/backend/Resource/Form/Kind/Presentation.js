import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindPresentation extends PureComponent {

  static displayName = "Resource.Form.Kind.Presentation";

  static propTypes = {
  };

  render() {
    const existingModel = some(this.props.sourceModel.attributes);
    return (
      <Form.Upload
        style="square"
        label="Presentation File"
        accepts="presentation"
        current={existingModel ? this.props.sourceModel.attributes.attachmentFileName : null}
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

}

