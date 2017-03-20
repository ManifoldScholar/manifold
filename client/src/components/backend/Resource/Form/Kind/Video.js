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
    const isExternal = !!some(this.props.sourceModel.attributes.externalType);
    return {
      externalVideo: isExternal
    };
  }

  truthy(value) {
    return value === true || value === "true";
  }

  setVideoKind(event) {
    if (!event.target.value) return null;
    this.setState({ externalVideo: this.truthy(event.target.value) });
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
    const existingModel = some(this.props.sourceModel.attributes);
    return (
      <Form.Upload
        style="square"
        label="Video File"
        accepts="video"
        current={existingModel ? this.props.sourceModel.attributes.attachmentFileName : null}
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
        {this.state.externalVideo ?
          this.renderExternalVideoForm()
          : this.renderVideoAttachmentForm()
        }
      </div>
    );
  }

}

