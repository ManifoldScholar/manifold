import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import setter from "./setter";
import Base from "./Upload/Base";
import tus from "tus-js-client";
import config from "config";

export class FormTusUpload extends Component {
  static displayName = "Form.TusUpload";

  static propTypes = {
    set: PropTypes.func.isRequired, // set is called when the value changes
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    inlineStyle: PropTypes.object,
    name: PropTypes.string, // name of the model field: attributes[avatar]
    layout: PropTypes.oneOf([
      "square",
      "portrait",
      "landscape",
      "horizontal",
      "embed"
    ]),
    placeholder: PropTypes.string, // Allows override of placeholder graphic
    remove: PropTypes.string, // name of the model remove field: attributes[removeAvatar]
    value: PropTypes.any, // the current value of the field in the connected model
    initialValue: PropTypes.string, // the initial value of the input when it's rendered
    errors: PropTypes.array,
    t: PropTypes.func
  };

  static defaultProps = {
    layout: "square"
  };

  constructor(props) {
    super(props);
    this.state = {
      progress: null,
      error: null
    };
  }

  get idPrefix() {
    return "upload";
  }

  get idForErrorPrefix() {
    return "upload-error";
  }

  get idForInstructionsPrefix() {
    return "upload-instructions";
  }

  removeFile() {
    this.props.set(null);
    this.setState({ progress: null, error: null });
  }

  handleUploadError = error => {
    // eslint-disable-next-line no-console
    console.log(error, "TUS Upload Error");
    this.setState({ error: this.props.t("errors.upload_failed") });
  };

  handleUploadProgress = (bytesUploaded, bytesTotal) => {
    const progress = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
    this.setState({ progress });
  };

  handleUploadSuccess = (tusUpload, attachment) => {
    const { type: mimeType, size, name: filename } = attachment;
    const { set } = this.props;
    const source = {
      id: tusUpload.url,
      storage: "cache",
      metadata: {
        filename,
        size,
        mimeType
      }
    };
    set(source);
  };

  updateValue = state => {
    const { attachment } = state;
    if (attachment) {
      const { type: mimeType, name: filename } = attachment;
      const upload = new tus.Upload(attachment, {
        chunkSize: 5 * 1024 * 1024,
        endpoint: config.services.api + "/api/files",
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
          filename,
          mimeType
        },
        resume: false,
        onError: this.handleUploadError,
        onProgress: this.handleUploadProgress,
        onSuccess: () => this.handleUploadSuccess(upload, attachment)
      });
      this.setState({ progress: null, error: null }, () => {
        upload.start();
      });
    } else {
      this.removeFile();
    }
  };

  render() {
    const { set: setIgnored, ...baseProps } = this.props;
    return (
      <UIDConsumer>
        {id => (
          <Base
            {...baseProps}
            accepts={{
              accepts: null,
              extensions: null
            }}
            progress={this.state.progress}
            uploadError={this.state.error}
            updateValue={this.updateValue}
            inputId={`${this.idPrefix}-${id}`}
            idForError={`${this.idForErrorPrefix}-${id}`}
            idForInstructions={`${this.idForInstructionsPrefix}-${id}`}
          />
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(setter(FormTusUpload));
