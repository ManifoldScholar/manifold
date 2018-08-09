import React, { PureComponent } from "react";
import PropTypes from "prop-types";

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
          <i className="manicon manicon-document" aria-hidden="true" />
          <p className="primary">{this.props.fileName}</p>
          <p className="secondary">
            <span
              role="button"
              tabIndex="0"
              className="fake-link"
              onClick={this.props.handleRemove}
              href="#"
            >
              Remove this file
            </span>
            <br />
            or{" "}
            <span className="fake-link" role="button" tabIndex="0">
              Upload a new file
            </span>
          </p>
        </div>
      </div>
    );
  }
}
