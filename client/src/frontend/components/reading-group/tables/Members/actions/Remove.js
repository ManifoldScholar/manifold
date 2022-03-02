import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";

function RemoveMember({ onClick }) {
  const { t } = useTranslation();
  return (
    <Action onClick={onClick} className="button-lozenge-primary--warn">
      {t("actions.remove")}
    </Action>
  );
}

RemoveMember.displayName = "MembersTable.Member.Remove";

RemoveMember.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default RemoveMember;
