import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import PropTypes from "prop-types";
import { Prompt } from "../Base/styles";
import * as Styled from "./styles";

export default class FormUploadEmpty extends PureComponent {
  static propTypes = {
    accepts: PropTypes.object,
    placeholder: PropTypes.string,
    progress: PropTypes.string,
    uploadError: PropTypes.string
  };

  static defaultProps = {
    placeholder: "cover"
  };

  get extensions() {
    if (!this.props.accepts || !this.props.accepts.extensions) return null;
    return this.props.accepts.extensions;
  }

  render() {
    return (
      <Styled.Wrapper>
        <Styled.Icon icon="upload64" size={82} />
        <div>
          <Styled.PrimaryText>
            {this.props.progress ? (
              <span>
                <Trans
                  i18nKey="forms.upload.progress"
                  values={{ percent: this.props.progress }}
                />
              </span>
            ) : (
              <>
                <Trans
                  i18nKey="forms.upload.instructions"
                  components={[<Prompt />]}
                />
                {this.props.uploadError ? (
                  <Styled.Error>{this.props.uploadError}</Styled.Error>
                ) : null}
              </>
            )}
          </Styled.PrimaryText>
          {this.extensions ? (
            <Styled.SecondaryText>{this.extensions}</Styled.SecondaryText>
          ) : null}
        </div>
      </Styled.Wrapper>
    );
  }
}
