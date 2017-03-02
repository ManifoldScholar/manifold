import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';
import some from 'lodash/some';

export default class ResourceFormKindVideo extends PureComponent {

  static displayName = "Resource.Form.Kind.Video";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = this.setInitialState();
    this.setVideoKind = this.setVideoKind.bind(this);
  }

  setInitialState() {
    const init = this.props.sourceModel.attributes.isExternalVideo;
    return {
      isExternalVideo: init
    };
  }

  setVideoKind(value) {
    this.setState({ isExternalVideo: value });
  }

  renderExternalVideoForm() {
    return (
      <div className="form-section">
        <Form.TextInput
          label="Video ID"
          name="attributes[externalId]"
          placeholder="Video ID"
          {...this.props}
        />
        <Form.Select
          label="External Video Type"
          name="attributes[externalType]"
          selected={this.props.sourceModel.attributes.externalType}
          options={[
            { label: "Select a video source...", value: "" },
            { label: "Youtube", value: "youtube" },
            { label: "Vimeo", value: "vimeo" }
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
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }

  render() {
    return (
      <div className="form-section">
        <Form.Switch
          label="Is this an externally linked video?"
          set={this.setVideoKind}
          value={this.state.isExternalVideo}
        />
        {this.state.isExternalVideo ?
          this.renderExternalVideoForm()
          : this.renderVideoAttachmentForm()
        }
        <Form.Hidden
          name="attributes[isExternalVideo]"
          value={this.state.isExternalVideo}
          {...this.props}
        />
      </div>
    );
  }

}

