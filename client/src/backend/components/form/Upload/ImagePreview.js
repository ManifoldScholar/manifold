import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";

export default class FormUploadImagePreview extends PureComponent {
  static propTypes = {
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    handleRemove: PropTypes.func.isRequired
  };

  get imageUrl() {
    if (isString(this.props.image)) return this.props.image;
    if (this.props.image.hasOwnProperty("data")) {
      return this.props.image.data;
    }
    return "";
  }

  render() {
    return (
      <div className="contents-image-preview" data-id="preview">
        <div className="message">
          <p className="secondary">
            <button
              tabIndex="0"
              data-id="remove"
              className="form-dropzone__inline-button"
              onClick={this.props.handleRemove}
            >
              Remove this image
            </button>
            <br />
            or{" "}
            <button
              className="form-dropzone__inline-button"
              aria-hidden
              tabIndex="-1"
            >
              Upload an image
            </button>
          </p>
        </div>
        <img alt="Upload preview" className="preview" src={this.imageUrl} />
        <span className="screen-reader-text">Upload Preview</span>
      </div>
    );
  }
}
