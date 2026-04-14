import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "components/global/table/Action";

function EditMember({ membership, readingGroup }) {
  const { t } = useTranslation();

  return (
    <Action to={`/groups/${readingGroup.id}/members/${membership.id}`}>
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
