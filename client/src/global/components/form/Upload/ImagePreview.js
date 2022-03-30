import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Trans, withTranslation } from "react-i18next";
import isString from "lodash/isString";

class FormUploadImagePreview extends PureComponent {
  static propTypes = {
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    handleRemove: PropTypes.func.isRequired,
    t: PropTypes.func
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
            <Trans
              i18nKey="forms.upload.image_preview"
              components={[
                <button
                  type="button"
                  data-id="remove"
                  className="form-dropzone__inline-button"
                  onClick={this.props.handleRemove}
                />,
                <span className="form-dropzone__upload-prompt" />
              ]}
            />
          </p>
        </div>
        <img
          alt={this.props.t("image_preview_alt")}
          className="preview"
          src={this.imageUrl}
        />
      </div>
    );
  }
}

export default withTranslation()(FormUploadImagePreview);
