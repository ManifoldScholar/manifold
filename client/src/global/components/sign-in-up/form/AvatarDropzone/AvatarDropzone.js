import React from "react";
import Form from "global/components/form";
import Dropzone from "react-dropzone";
import IconComposer from "global/components/utility/IconComposer";
import Avatar from "global/components/avatar";
import { useTranslation, Trans } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { useUID } from "react-uid";

export default function AvatarDropzone({ errors }) {
  const { t } = useTranslation();
  const uid = useUID();

  const { watch, setValue } = useFormContext();

  const showAvatar = !!watch("avatar");
  const removeAvatar = () => {
    setValue("avatar", null, { shouldDirty: true, shouldValidate: false });
  };
  const handleDrop = file => {
    setValue("avatar", file[0], { shouldDirty: true, shouldValidate: false });
  };
  const avatarUrl = watch("avatar")?.preview;

  return __BROWSER__ ? (
    <div className="row-1-p">
      {showAvatar ? null : (
        <p className="overlay-copy">
          {t("forms.signin_overlay.profile_img_instructions")}
        </p>
      )}
      <Form.Errorable
        className="form-input"
        idForError="avatar-error"
        name="attributes.avatar"
        errors={errors}
      >
        <label htmlFor="avatar-update" className="screen-reader-text">
          {t("forms.signin_overlay.profile_img")}
        </label>
        <Dropzone onDrop={handleDrop}>
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
                  id: `${uid}_avatar`,
                  "aria-describedby": "avatar-error",
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
                  {showAvatar && (
                    <button
                      onClick={removeAvatar}
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
