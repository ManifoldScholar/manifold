import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import { Prompt } from "../Base/styles";
import * as Styled from "./styles";

export default class FormUploadFilePreview extends PureComponent {
  static propTypes = {
    fileName: PropTypes.string,
    handleRemove: PropTypes.func.isRequired
  };

  static defaultProps = {};

  render() {
    return (
      <Styled.Preview>
        <Styled.Message data-id="preview">
          <Styled.Icon icon="resourceDocument64" size="default" />
          <Styled.PrimaryText>{this.props.fileName}</Styled.PrimaryText>
          <Styled.SecondaryText>
            <Trans
              i18nKey="forms.upload.instructions_with_existing"
              components={[
                <Styled.Button
                  type="button"
                  onClick={this.props.handleRemove}
                />,
                <Prompt />
              ]}
            />
          </Styled.SecondaryText>
        </Styled.Message>
      </Styled.Preview>
    );
  }
}
