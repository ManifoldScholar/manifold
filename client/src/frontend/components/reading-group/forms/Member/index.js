import React, { useState } from "react";
import PropTypes from "prop-types";
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
        label="Member Name"
        name="attributes[name]"
      />
      {!userIsGroupCreator && (
        <Form.Radios
          label="Role"
          name="attributes[role]"
          beforeOnChange={warnOnRoleChange}
          instructions="Members can see group annotations and annotate within the group. Moderators can manage members and update group settings."
          options={[
            { label: "Member", value: "member" },
            { label: "Moderator", value: "moderator" }
          ]}
          inline
          wide
          focusOnMount
        />
      )}
      <Form.TextInput
        wide
        label="Label"
        name="attributes[label]"
        placeholder="Enter a label"
        instructions="Labels are used to describe specific members within the group and appear next to the name in the membership list."
        focusOnMount={userIsGroupCreator}
      />
      <Form.Select
        label="Annotation Style"
        name="attributes[annotationStyle]"
        beforeOnChange={handleStyleSelectChange}
        instructions="Annotation styles will appear in the Manifold reading interface and can be used to call differentiate a user's annotations from other annotations in the reading group."
        options={[
          { label: "Dashed", value: "dashes" },
          { label: "Dotted", value: "dots" },
          { label: "Solid", value: "solid" },
          { label: "Wavy", value: "wavy" }
        ]}
        rounded
      />
      <StylePreview style={selectedStyle} />
      <Form.Save text="Save" theme="frontend" />
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
