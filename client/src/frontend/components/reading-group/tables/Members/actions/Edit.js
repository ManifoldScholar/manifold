import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";
import lh from "helpers/linkHandler";

function EditMember({ membership, readingGroup }) {
  const { t } = useTranslation();

  return (
    <Action
      to={lh.link("frontendReadingGroupMember", readingGroup.id, membership.id)}
    >
      {t("actions.edit")}
    </Action>
  );
}

EditMember.displayName = "MembersTable.Member.Edit";

EditMember.propTypes = {
  membership: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired
};

export default EditMember;
