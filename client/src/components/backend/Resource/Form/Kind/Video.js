import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindVideo extends PureComponent {

  static displayName = "Resource.Form.Kind.Video";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      externalVideo: false
    };
    this.setVideoKind = this.setVideoKind.bind(this);
  }

  truthy(value) {
    return value === true || value === "true";
  }

  setVideoKind(event) {
    if (!event.target.value) return null;
    this.setState({externalVideo: this.truthy(event.target.value)});
  }

  renderExternalVideoForm() {
    return (
      <div className="form-section">
        <Form.TextInput
          label="Video URL"
          name="attributes[externalUrl]"
          placeholder="Video Url"
          {...this.props}
        />
        <Form.Select
          label="External Video Type"
          name="attributes[externalType]"
          selected={this.props.sourceModel.attributes.externalType}
          options={[
            {label: "Select a video source...", value: ""},
            {label: "Youtube", value: "youtube"},
            {label: "Vimeo", value: "vimeo"}
          ]}
          {...this.props}
        />
      </div>
    );
  }

  renderVideoAttachmentForm() {
    return (
      <Form.Upload
        style="square"
        label="Video File"
        accepts="video"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

  render() {
    return (
      <div className="form-section">
        <div className="form-input">
          <label>Is this an externally linked video?</label>
          <Form.Helpers.SwitchInput
            onChange={this.setVideoKind}
            value={this.state.externalVideo}
          />
        </div>
        {this.state.externalVideo ? this.renderExternalVideoForm() : this.renderVideoAttachmentForm()}
      </div>
    )
  }

}

