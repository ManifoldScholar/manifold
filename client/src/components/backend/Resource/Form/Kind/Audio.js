import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindAudio extends PureComponent {

  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {
  };

  render() {
    return (
      <Form.Upload
        style="square"
        label="Audio File"
        accepts="audio"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    )
  }

}

