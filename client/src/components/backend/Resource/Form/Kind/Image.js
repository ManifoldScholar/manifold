import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindImage extends PureComponent {

  static displayName = "Resource.Form.Kind.Image";

  static propTypes = {
  };

  render() {
    const existingModel = some(this.props.sourceModel.attributes);
    return (
      <Form.Upload
        style="square"
        label="Image File"
        accepts="images"
        current={existingModel ? this.props.sourceModel.attributes.attachmentStyles.smallSquare : null}
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

