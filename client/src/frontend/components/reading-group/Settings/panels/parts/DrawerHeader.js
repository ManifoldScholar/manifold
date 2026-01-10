import { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useArchiveOrActivateGroup } from "frontend/components/reading-group/hooks";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import { readingGroupsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";

export default function DrawerHeader({ readingGroup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    confirm: confirmDelete,
    confirmation: deleteConfirmation
  } = useConfirmation();

  const membership =
    readingGroup.relationships.currentUserReadingGroupMembership;
  const {
    onClick: onArchiveClick,
    label: archiveLabel,
    confirmation: archiveConfirmation
  } = useArchiveOrActivateGroup({
    membership
  });

  const handleDelete = useCallback(() => {
    const heading = t("messages.reading_group.destroy_heading");
    const message = t("messages.reading_group.destroy_message");
    confirmDelete({
      heading,
      message,
      callback: async closeDialog => {
        try {
          await queryApi(readingGroupsAPI.destroy(readingGroup.id));
          navigate("/my/groups");
          closeDialog();
        } catch (err) {
          console.error(err);
        }
      }
    });
  }, [confirmDelete, t, readingGroup.id, navigate]);

  const { toggleProps } = useCollapseContext();

  const buttons = [
    ...(readingGroup.links?.clone
      ? [
          {
            icon: "duplicate24",
            label: t("actions.duplicate"),
            className: "utility-button__icon",
            ...toggleProps
          }
        ]
      : []),
    ...(membership
      ? [
          {
            onClick: onArchiveClick,
            icon: "archive24",
            label: archiveLabel,
            className: "utility-button__icon"
          }
        ]
      : []),
    {
      onClick: handleDelete,
      icon: "delete24",
      label: t("actions.delete"),
      className: "utility-button__icon utility-button__icon--notice"
    }
  ];

  return (
    <>
      {archiveConfirmation}
      {deleteConfirmation && <Dialog.Confirm {...deleteConfirmation} />}
      <Layout.DrawerHeader
        title={t("forms.edit_group.title")}
        buttons={buttons}
        buttonLayout="inline"
        small
      />
    </>
  );
}

DrawerHeader.displayName = "ReadingGroup.Settings.DrawerHeader";

DrawerHeader.propTypes = {
  readingGroup: PropTypes.object.isRequired
};
