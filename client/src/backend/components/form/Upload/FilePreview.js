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
