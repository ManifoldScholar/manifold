import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { readingGroupMembershipsAPI, requests } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import config from "config";
import StylePreview from "./StylePreview";

function ReadingGroupMemberForm({
  membership,
  readingGroup,
  confirm,
  onSuccess
}) {
  const { t } = useTranslation();

  const [selectedStyle, setSelectedStyle] = useState(
    membership.attributes.annotationStyle
  );

  function warnOnRoleChange(initialValue, newValue) {
    let msg = null;
    const {
      heading,
      memberToModerator,
      moderatorToMember
    } = config.app.locale.dialogs.readingGroupMembership.warn.roleChange;
    if (initialValue === "moderator" && newValue === "member")
      msg = moderatorToMember;
    if (initialValue === "member" && newValue === "moderator")
      msg = memberToModerator;
    if (msg !== null) return confirm(heading, msg, () => {});
  }

  function handleStyleSelectChange(initialValueIgnored, newValue) {
    setSelectedStyle(newValue);
  }

  const userIsGroupCreator =
    membership.relationships.user.id === readingGroup.attributes.creatorId;

  return (
    <FormContainer.Form
      model={membership}
      name={requests.feReadingGroupMembershipEdit}
      update={readingGroupMembershipsAPI.update}
      onSuccess={onSuccess}
      className="form-secondary member-settings-form"
      notificationScope="drawer"
    >
      <Form.TextInput
        wide
        isDisabled
        label={t("forms.reading_group_member.name")}
        name="attributes[name]"
      />
      {!userIsGroupCreator && (
        <Form.Radios
          label={t("forms.reading_group_member.role")}
          name="attributes[role]"
          beforeOnChange={warnOnRoleChange}
          instructions={t("forms.reading_group_member.role_instructions")}
          options={[
            {
              label: t("forms.reading_group_member.role_options.member"),
              value: "member"
            },
            {
              label: t("forms.reading_group_member.role_options.moderator"),
              value: "moderator"
            }
          ]}
          inline
          wide
          focusOnMount
        />
      )}
      <Form.TextInput
        wide
        label={t("forms.reading_group_member.label")}
        name="attributes[label]"
        placeholder={t("forms.reading_group_member.label_placeholder")}
        instructions={t("forms.reading_group_member.label_instructions")}
        focusOnMount={userIsGroupCreator}
      />
      <Form.Select
        label={t("forms.reading_group_member.annotation_style")}
        name="attributes[annotationStyle]"
        beforeOnChange={handleStyleSelectChange}
        instructions={t(
          "forms.reading_group_member.annotation_style_instructions"
        )}
        options={[
          {
            label: t(
              "forms.reading_group_member.annotation_style_options.dashed"
            ),
            value: "dashes"
          },
          {
            label: t(
              "forms.reading_group_member.annotation_style_options.dotted"
            ),
            value: "dots"
          },
          {
            label: t(
              "forms.reading_group_member.annotation_style_options.solid"
            ),
            value: "solid"
          },
          {
            label: t(
              "forms.reading_group_member.annotation_style_options.wavy"
            ),
            value: "wavy"
          }
        ]}
        rounded
      />
      <StylePreview style={selectedStyle} />
      <Form.Save text={t("actions.save")} theme="frontend" />
    </FormContainer.Form>
  );
}

ReadingGroupMemberForm.displayName = "ReadingGroup.Forms.MemberSettings";

ReadingGroupMemberForm.propTypes = {
  membership: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default ReadingGroupMemberForm;
