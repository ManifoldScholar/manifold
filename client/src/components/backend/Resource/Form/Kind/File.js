import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindFile extends PureComponent {

  static displayName = "Resource.Form.Kind.File";

  static propTypes = {
    fileType: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const existingModel = some(this.props.sourceModel.attributes);
    return (
      <Form.Upload
        style="square"
        label="File"
        accepts="all"
        current={existingModel ? this.props.sourceModel.attributes.attachmentFileName : null}
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

