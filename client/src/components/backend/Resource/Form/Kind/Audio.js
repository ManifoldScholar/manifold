import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindAudio extends PureComponent {

  static displayName = "Resource.Form.Kind.Audio";

  static propTypes = {
  };

  render() {
    const existingModel = some(this.props.sourceModel.attributes);
    return (
      <div className="form-section">
        <Form.Upload
          style="square"
          label="Audio File"
          accepts="audio"
          current={existingModel ? this.props.sourceModel.attributes.attachmentFileName : null}
          name="attributes[attachment]"
          remove="attributes[removeAttachment]"
          {...this.props}
        />
      </div>
    );
  }

}

