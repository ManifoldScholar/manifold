import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindExternalVideo extends PureComponent {

  static displayName = "Resource.Form.Kind.Link";

  static propTypes = {
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          focusOnMount
          label="External Video URL"
          name="attributes[externalUrl]"
          placeholder="External Video Url"
          {...this.props}
        />
        <Form.Select
          focusOnMount
          label="External Video Type"
          name="attributes[externalType]"
          selected={this.props.sourceModel.attributes.externalType}
          options={[
            {label: "Select a video type...", value: ""},
            {label: "Youtube", value: "youtube"},
            {label: "Vimeo", value: "vimeo"}
          ]}
          {...this.props}
        />
      </div>
    )
  }

}

