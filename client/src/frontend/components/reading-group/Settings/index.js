import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UnmountClosed as Collapse } from "react-collapse";
import Layout from "backend/components/layout";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import { useArchiveOrActivateGroup } from "frontend/components/reading-group/hooks";
import withConfirmation from "hoc/withConfirmation";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { DuplicatePanel } from "./panels";

const { request } = entityStoreActions;

function ReadingGroupSettings({
  readingGroup,
  closeDrawer,
  confirm,
  onArchive
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const membership =
    readingGroup.relationships.currentUserReadingGroupMembership;
  const {
    onClick: onArchiveClick,
    label: archiveLabel
  } = useArchiveOrActivateGroup({
    membership,
    confirm,
    callback: onArchive
  });
  const [showActionPanel, setShowActionPanel] = useState(null);

  function handleDrawerToggle(action) {
    showActionPanel === action
      ? setShowActionPanel(null)
      : setShowActionPanel(action);
  }

  function cancelAction() {
    setShowActionPanel(null);
  }

  function doDuplicate({ name, copyAnnotations, archive, openOnProceed }) {
    const options = {
      body: JSON.stringify({
        type: "readingGroups",
        data: {
          attributes: {
            name,
            archive,
            cloneOwnedAnnotations: copyAnnotations
          }
        }
      })
    };
    const {
      href: endpoint,
      meta: { method }
    } = readingGroup.links.clone;
    const call = {
      endpoint,
      method,
      options
    };
    const duplicateRequest = request(call, requests.feReadingGroupClone, {});
    dispatch(duplicateRequest).promise.then(({ data: { id } }) => {
      if (openOnProceed) {
        history.push(lh.link("frontendReadingGroupDetail", id));
      } else {
        closeDrawer();
      }
    });
  }

  function handleDelete() {
    const heading = t("messages.reading_group.destroy_heading");
    const message = t("messages.reading_group.destroy_message");
    confirm(heading, message, () => {
      const call = readingGroupsAPI.destroy(readingGroup.id);
      const options = { removes: readingGroup };
      const readingGroupRequest = request(
        call,
        requests.feReadingGroupDestroy,
        options
      );
      dispatch(readingGroupRequest).promise.then(() => {
        history.push(lh.link("frontendMyReadingGroups"));
      });
    });
  }

  const buttons = [
    ...(readingGroup.links?.clone
      ? [
          {
            onClick: () => handleDrawerToggle("duplicate"),
            icon: "duplicate24",
            label: t("actions.duplicate"),
            className: "utility-button__icon",
            ariaProps: {
              "aria-expanded": showActionPanel === "duplicate",
              "aria-controls": "group-settings-duplicate-region"
            }
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
    <section>
      <Layout.DrawerHeader
        title={t("forms.edit_group.title")}
        buttons={buttons}
        buttonLayout="inline"
        small
      />
      <div role="region" id="group-settings-duplicate-region">
        <Collapse isOpened={showActionPanel === "duplicate"}>
          <DuplicatePanel
            readingGroup={readingGroup}
            onProceed={doDuplicate}
            onCancel={cancelAction}
          />
        </Collapse>
      </div>
      <GroupSettingsForm
        mode="edit"
        group={readingGroup}
        onSuccess={closeDrawer}
      />
    </section>
  );
}

ReadingGroupSettings.displayName = "ReadingGroup.Settings";

ReadingGroupSettings.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  onArchive: PropTypes.func
};

export default withConfirmation(ReadingGroupSettings);
