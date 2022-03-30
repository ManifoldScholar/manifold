import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
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
            className="contents-icon-preview__icon"
          />
          <p className="primary">{this.props.fileName}</p>
          <p className="secondary">
            <Trans
              i18nKey="forms.upload.instructions_with_existing"
              components={[
                <button
                  type="button"
                  className="form-dropzone__inline-button"
                  onClick={this.props.handleRemove}
                />,
                <span className="form-dropzone__upload-prompt" />
              ]}
            />
          </p>
        </div>
      </div>
    );
  }
}
