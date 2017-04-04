import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindInteractive extends PureComponent {

  static displayName = "Resource.Form.Kind.Interactive";

  static propTypes = {
  };

  renderIframeForm() {
    return (
      <div className="form-section">
        <Form.TextInput
          label="Dimensions"
          name="attributes[iframeDimensions]"
          placeholder="Enter length and height (e.g., 1440x900)"
          {...this.props}
        />
        <Form.TextInput
          label="iFrame URL"
          name="attributes[externalUrl]"
          placeholder="Enter iFrame URL"
          {...this.props}
        />
      </div>
    );
  }

  renderEmbedForm() {
    return (
      <div className="form-section">
        <Form.TextArea
          label="Embed Code"
          name="attributes[embedCode]"
          placeholder="Enter HTML embed code"
          {...this.props}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="form-section">
        <Form.Switch
          label="Is this an iFrame?"
          name="attributes[isIframe]"
          {...this.props}
        />
        {this.props.getModelValue("attributes[isIframe]") ?
          this.renderIframeForm()
          : this.renderEmbedForm()
        }
      </div>
    );
  }

}

