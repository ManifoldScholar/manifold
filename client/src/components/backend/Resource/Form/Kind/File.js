import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
    return (
      <Form.Upload
        style="square"
        label="File"
        accepts="all"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

}

