import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindVideo extends PureComponent {
  static displayName = "Resource.Form.Kind.Video";

  static propTypes = {
    sourceModel: PropTypes.object,
    getModelValue: PropTypes.func,
    t: PropTypes.func
  };

  renderExternalVideoForm() {
    return (
      <Form.FieldGroup>
        <Form.TextInput
          label={this.props.t("backend.forms.resource.video_id")}
          name="attributes[externalId]"
          placeholder={this.props.t(
            "backend.forms.resource.video_id_placeholder"
          )}
          instructions={this.props.t(
            "backend.forms.resource.video_id_instructions"
          )}
          {...this.props}
        />
        <Form.Select
          label={this.props.t("backend.forms.resource.external_video_type")}
          name="attributes[externalType]"
          selected={this.props.sourceModel.attributes.externalType}
          options={[
            {
              label: this.props.t("backend.forms.resource.select_source"),
              value: ""
            },
            { label: "Youtube", value: "youtube" },
            { label: "Vimeo", value: "vimeo" }
          ]}
          {...this.props}
        />
      </Form.FieldGroup>
    );
  }

  renderVideoAttachmentForm() {
    return (
      <Form.Upload
        layout="square"
        label={this.props.t("backend.forms.resource.video_file")}
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
      <Form.FieldGroup>
        <Form.Switch
          label={this.props.t("backend.forms.resource.video_source")}
          name="attributes[subKind]"
          customValues={{
            true: "external_video",
            false: ""
          }}
          {...this.props}
          wide
          isPrimary
        />
        {this.props.getModelValue("attributes[subKind]")
          ? this.renderExternalVideoForm()
          : this.renderVideoAttachmentForm()}
      </Form.FieldGroup>
    );
  }
}

export default withTranslation()(ResourceFormKindVideo);
