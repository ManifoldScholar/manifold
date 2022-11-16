import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Errorable from "../../Errorable";
import { t } from "i18next";
import { Trans } from "react-i18next";
import BaseLabel from "../../BaseLabel";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default class UserAvatarUpload extends Component {
  static displayName = "Form.Upload.UserAvatar";

  static propTypes = {
    updateValue: PropTypes.func.isRequired, // set is called when the value changes
    label: PropTypes.string,
    name: PropTypes.string, // name of the model field: attributes[avatar]
    layout: PropTypes.oneOf([
      "square",
      "portrait",
      "landscape",
      "horizontal",
      "embed"
    ]),
    placeholder: PropTypes.string, // Allows override of placeholder graphic
    remove: PropTypes.string, // name of the model remove field: attributes[removeAvatar]
    value: PropTypes.any, // the current value of the field in the connected model
    initialValue: PropTypes.string, // the initial value of the input when it's rendered
    errors: PropTypes.array,
    inputId: PropTypes.string.isRequired,
    idForInstructions: PropTypes.string.isRequired,
    fileNameFrom: PropTypes.string,
    uploadError: PropTypes.string,
    getModelValue: PropTypes.func
  };

  static defaultProps = {
    layout: "square",
    accepts: null,
    wide: false
  };

  constructor(props) {
    super(props);
    this.state = {
      removed: false,
      attachment: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.attachment !== prevState.attachment ||
      this.state.removed !== prevState.removed
    ) {
      this.props.updateValue(this.state);
    }
  }

  get fileName() {
    if (!this.props.fileNameFrom) return null;
    return this.props.getModelValue(this.props.fileNameFrom);
  }

  handleFileDrop = file => {
    this.setState({ attachment: file[0], removed: false });
  };

  handleRemove = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ attachment: null, removed: true });
  };

  hasAvatar = () => {
    return !!this.currentPreview;
  };

  currentPreview = () => {
    if (this.state.removed) return null;
    if (this.props.value) return this.props.value;
    if (this.props.initialValue) return this.props.initialValue;
    return null;
  };

  previewUrl = () => {
    const preview = this.currentPreview();
    return typeof preview === "string" ? preview : preview?.data ?? "";
  };

  render() {
    const hasAvatar = !!this.currentPreview();

    return (
      <div>
        {hasAvatar ? null : (
          <Styled.Instructions>
            {t("forms.signin_overlay.profile_img_instructions")}
          </Styled.Instructions>
        )}
        <Errorable
          name="attributes[avatar]"
          errors={this.props.errors}
          idForError="avatar-update-error"
        >
          {this.props.label ? (
            <BaseLabel
              id={this.props.inputId}
              label={this.props.label}
              className="screen-reader-text"
            />
          ) : null}
          <Dropzone onDrop={this.handleFileDrop}>
            {({ getRootProps, getInputProps }) => (
              <Styled.Dropzone
                {...getRootProps({
                  tabIndex: null
                })}
              >
                <Styled.DropzoneInput
                  {...getInputProps({
                    accept: "image/*",
                    multiple: false,
                    id: "avatar-update",
                    "aria-describedby": "avatar-update-error",
                    tabIndex: 0
                  })}
                />
                <Styled.DropzoneOutline>
                  <Styled.RemoveWrapper>
                    {hasAvatar && (
                      <Styled.RemoveButton
                        onClick={this.handleRemove}
                        tabIndex="0"
                      >
                        <IconComposer icon="close16" size="default" />
                        <span className="screen-reader-text">
                          {t("forms.signin_overlay.remove_avatar")}
                        </span>
                      </Styled.RemoveButton>
                    )}
                    <Styled.Avatar url={this.previewUrl()} />
                  </Styled.RemoveWrapper>
                  <Styled.DropzonePrompt>
                    <Trans
                      i18nKey="forms.signin_overlay.upload_avatar_instructions"
                      components={[<Styled.UploadLink />]}
                    />
                  </Styled.DropzonePrompt>
                </Styled.DropzoneOutline>
              </Styled.Dropzone>
            )}
          </Dropzone>
        </Errorable>
      </div>
    );
  }
}
