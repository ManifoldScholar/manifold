import React from "react";
import Form from "global/components/form";
import Dropzone from "react-dropzone";
import IconComposer from "global/components/utility/IconComposer";
import { useTranslation, Trans } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { useUID } from "react-uid";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function AvatarDropzone({ errors }) {
  const { t } = useTranslation();
  const uid = useUID();

  const { watch, setValue } = useFormContext();

  const showAvatar = !!watch("avatar");
  const avatarUrl = watch("avatar")?.preview;

  const removeAvatar = e => {
    e.stopPropagation();

    setValue("removeAvatar", true, {
      shouldDirty: true,
      shouldValidate: false
    });
    setValue("avatar", null);
  };

  const handleDrop = file => {
    const reader = new FileReader();
    reader.onload = () => {
      setValue(
        "avatar",
        {
          data: reader.result,
          content_type: file[0].type,
          filename: file[0].name
        },
        { shouldDirty: true, shouldValidate: false }
      );
    };
    reader.readAsDataURL(file[0]);
    setValue("removeAvatar", false);
  };

  return __BROWSER__ ? (
    <Styled.Wrapper>
      {showAvatar ? null : (
        <Styled.Instructions>
          {t("forms.signin_overlay.profile_img_instructions")}
        </Styled.Instructions>
      )}
      <Form.Errorable
        idForError="avatar-error"
        name="attributes.avatar"
        errors={errors}
      >
        <Styled.SRText htmlFor="avatar-update">
          {t("forms.signin_overlay.profile_img")}
        </Styled.SRText>
        <Dropzone onDrop={handleDrop}>
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
                  id: `${uid}_avatar`,
                  "aria-describedby": "avatar-error",
                  tabIndex: 0
                })}
              />
              <Styled.DropzoneOutline>
                <Styled.RemoveWrapper>
                  {showAvatar && (
                    <Styled.RemoveButton type="button" onClick={removeAvatar}>
                      <IconComposer icon="close16" size="default" />
                      <Styled.SRText as="span">
                        {t("forms.signin_overlay.remove_avatar")}
                      </Styled.SRText>
                    </Styled.RemoveButton>
                  )}
                  <Styled.Avatar url={avatarUrl} />
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
      </Form.Errorable>
    </Styled.Wrapper>
  ) : null;
}

AvatarDropzone.displayName = "Global.SignInUp.Inputs.AvatarDropzone";

AvatarDropzone.propTypes = {
  errors: PropTypes.array
};
