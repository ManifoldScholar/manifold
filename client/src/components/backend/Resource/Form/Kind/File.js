import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindFile extends PureComponent {

  static displayName = "Resource.Form.Kind.File";

  static propTypes = {
    fileType: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form.Upload
        style="square"
        label="File"
        accepts="all"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

