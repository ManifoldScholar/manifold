import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";
import lh from "helpers/linkHandler";

function EditGroup({ readingGroup }) {
  const { t } = useTranslation();

  const canEdit = readingGroup.attributes.abilities.update;

  if (!canEdit) return null;

  const baseLink = lh.link(
    "frontendReadingGroupHomepageStatic",
    readingGroup.id
  );
  const hash = "settings";
  return <Action to={`${baseLink}#${hash}`}>{t("actions.edit")}</Action>;
}

EditGroup.displayName = "GroupsTable.Group.Edit";

EditGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default EditGroup;
