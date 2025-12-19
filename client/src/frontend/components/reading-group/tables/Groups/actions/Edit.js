import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";

function EditGroup({ readingGroup }) {
  const { t } = useTranslation();

  const canEdit = readingGroup.attributes.abilities.update;

  if (!canEdit) return null;

  return (
    <Action to={`/groups/${readingGroup.id}/settings`}>
      {t("actions.edit")}
    </Action>
  );
}

EditGroup.displayName = "GroupsTable.Group.Edit";

EditGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default EditGroup;
