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
      <div className="contents-image-preview">
        <div
          data-id="preview"
          className="preview"
          style={{
            backgroundImage: `url(${this.imageUrl})`
          }}
        >
          <span className="screen-reader-text">Upload Preview</span>
        </div>
        <div className="message">
          <p className="secondary">
            <span
              role="button"
              tabIndex="0"
              data-id="remove"
              className="fake-link"
              onClick={this.props.handleRemove}
            >
              Remove this image
            </span>
            <br />
            or{" "}
            <span className="fake-link" role="button" tabIndex="0">
              Upload an image
            </span>
          </p>
        </div>
      </div>
    );
  }
}
