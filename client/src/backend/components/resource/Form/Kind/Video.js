import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";

export default class ResourceFormKindVideo extends PureComponent {
  static displayName = "Resource.Form.Kind.Video";

  static propTypes = {
    sourceModel: PropTypes.object,
    getModelValue: PropTypes.func
  };

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
        layout="square"
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
          name="attributes[subKind]"
          customValues={{
            true: "external_video",
            false: ""
          }}
          {...this.props}
        />
        {this.props.getModelValue("attributes[subKind]")
          ? this.renderExternalVideoForm()
          : this.renderVideoAttachmentForm()}
      </div>
    );
  }
}
