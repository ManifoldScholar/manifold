import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Trans, withTranslation } from "react-i18next";
import isString from "lodash/isString";
import { Prompt } from "../Base/styles";
import * as Styled from "./styles";

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
      <Styled.Preview data-id="preview">
        <Styled.Message>
          <Styled.SecondaryText>
            <Trans
              i18nKey="forms.upload.image_preview"
              components={[
                <Styled.Button
                  type="button"
                  data-id="remove"
                  onClick={this.props.handleRemove}
                />,
                <Prompt />
              ]}
            />
          </Styled.SecondaryText>
        </Styled.Message>
        <Styled.Image
          alt={this.props.t("image_preview_alt")}
          src={this.imageUrl}
        />
      </Styled.Preview>
    );
  }
}

export default withTranslation()(FormUploadImagePreview);
