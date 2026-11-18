import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUID } from "react-uid";
import Button from "backend/components/layout/PageHeader/utility/ActionButtons/Button";
import withConfirmation from "hoc/withConfirmation";
import { useArchiveOrActivateGroup } from "frontend/components/reading-group/hooks";
import { readingGroupMembershipsAPI, requests } from "api";
import { useApiCallback, useCurrentUser } from "hooks";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

function MembershipActions({ readingGroup, confirm, refresh }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const uid = useUID();

  const membership =
    readingGroup.relationships.currentUserReadingGroupMembership;

  const { onClick: onArchiveClick } = useArchiveOrActivateGroup({
    membership,
    confirm,
    callback: refresh
  });

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy, {
    requestKey: requests.feReadingGroupMembershipDestroy,
    removes: membership
  });

  if (!membership) return null;

  const archiveLabel = membership.links?.archive
    ? t("actions.archive_membership")
    : t("actions.activate_membership");

  const isCreator = currentUser?.id === readingGroup.attributes.creatorId;

  async function destroyMembership() {
    await deleteMembership(membership.id);
    navigate(lh.link("frontendMyReadingGroups"));
  }

  function onLeaveClick() {
    const heading = t("messages.membership.leave_heading");
    const message = t("messages.membership.leave_message");
    confirm(heading, message, destroyMembership);
  }

  const actions = [
    {
      onClick: onArchiveClick,
      icon: "archive24",
      label: archiveLabel,
      className: "utility-button__icon"
    },
    ...(!isCreator
      ? [
          {
            onClick: onLeaveClick,
            icon: "logout24",
            label: t("actions.leave_group"),
            className: "utility-button__icon"
          }
        ]
      : [])
  ];

  const labelId = `${uid}-membership-actions-label`;

  return (
    <Styled.MembershipActions
      role="group"
      aria-labelledby={labelId}
      className="utility-button-group utility-button-group--inline"
    >
      <span id={labelId} className="screen-reader-text">
        {t("forms.manage_membership.title")}
      </span>
      {actions.map(action => (
        <Button key={action.icon} action={action} iconSize={24} />
      ))}
    </Styled.MembershipActions>
  );
}

MembershipActions.displayName = "ReadingGroup.Heading.MembershipActions";

MembershipActions.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired
};

export default withConfirmation(MembershipActions);
