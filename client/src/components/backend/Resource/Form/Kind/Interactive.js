import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindInteractive extends PureComponent {

  static displayName = "Resource.Form.Kind.Interactive";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = this.setInitialState();
    this.setInteractiveKind = this.setInteractiveKind.bind(this);
  }

  setInitialState() {
    const init = this.props.sourceModel.attributes.isIframe;
    return {
      isIframe: init
    };
  }

  setInteractiveKind(value) {
    this.setState({ isIframe: value });
  }

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
          set={this.setInteractiveKind}
          value={this.state.isIframe}
        />
        {this.state.isIframe ?
          this.renderIframeForm()
          : this.renderEmbedForm()
        }
        <Form.Hidden
          name="attributes[isIframe]"
          value={this.state.isIframe}
          {...this.props}
        />
      </div>
    );
  }

}

