import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class FormUploadFilePreview extends PureComponent {
  static propTypes = {
    fileName: PropTypes.string,
    handleRemove: PropTypes.func.isRequired
  };

  static defaultProps = {};

  render() {
    return (
      <div className="contents-icon-preview">
        <div className="message" data-id="preview">
          <IconComposer
            icon="resourceDocument64"
            size="default"
            iconClass="contents-icon-preview__icon"
          />
          <p className="primary">{this.props.fileName}</p>
          <p className="secondary">
            <button
              type="button"
              className="form-dropzone__inline-button"
              onClick={this.props.handleRemove}
            >
              Remove this file
            </button>
            <br />
            or{" "}
            <span className="form-dropzone__upload-prompt">
              Upload a new file
            </span>
          </p>
        </div>
      </div>
    );
  }
}
