import React from "react";
import Form from "global/components/form";
import Dropzone from "react-dropzone";
import IconComposer from "global/components/utility/IconComposer";
import Avatar from "global/components/avatar";
import { useTranslation, Trans } from "react-i18next";

export default function AvatarDropzone({
  handleFileDrop,
  handleRemoveAvatar,
  avatarUrl,
  errors
}) {
  const { t } = useTranslation();

  const hasAvatar = !!avatarUrl;

  return __BROWSER__ ? (
    <div className="row-1-p">
      {hasAvatar ? null : (
        <p className="overlay-copy">
          {t("forms.signin_overlay.profile_img_instructions")}
        </p>
      )}
      <Form.Errorable
        className="form-input"
        idForError="avatar-update-error"
        name="attributes[avatar]"
        errors={errors}
      >
        <label htmlFor="avatar-update" className="screen-reader-text">
          {t("forms.signin_overlay.profile_img")}
        </label>
        <Dropzone onDrop={handleFileDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps({
                className: "form-dropzone",
                tabIndex: null
              })}
            >
              <input
                {...getInputProps({
                  accept: "image/*",
                  multiple: false,
                  id: "avatar-update",
                  "aria-describedby": "avatar-update-error",
                  tabIndex: 0
                })}
              />
              <div
                style={{ position: "relative" }}
                className="dropzone-button dropzone-button-dotted"
              >
                <div
                  style={{
                    top: "50%",
                    marginTop: -33,
                    height: 66,
                    width: 66,
                    position: "absolute"
                  }}
                >
                  {hasAvatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      tabIndex="0"
                      className="dropzone-button__cancel-button"
                    >
                      <IconComposer icon="close16" size="default" />
                      <span className="screen-reader-text">
                        {t("forms.signin_overlay.remove_avatar")}
                      </span>
                    </button>
                  )}
                  <Avatar style={{ margin: 0 }} url={avatarUrl} />
                </div>
                <span className="dropzone-button__text">
                  <Trans
                    i18nKey="forms.signin_overlay.upload_avatar_instructions"
                    components={[
                      <span className="form-dropzone__upload-prompt" />
                    ]}
                  />
                </span>
              </div>
            </div>
          )}
        </Dropzone>
      </Form.Errorable>
    </div>
  ) : null;
}
