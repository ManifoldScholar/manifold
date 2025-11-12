import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Collapse from "global/components/Collapse";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import withConfirmation from "hoc/withConfirmation";
import { requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { DuplicatePanel } from "./panels";
import DrawerHeader from "./panels/parts/DrawerHeader";

const { request } = entityStoreActions;

function ReadingGroupSettings({
  readingGroup,
  closeDrawer,
  confirm,
  onArchive
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        navigate(lh.link("frontendReadingGroupDetail", id));
      } else {
        closeDrawer();
      }
    });
  }

  return (
    <Collapse>
      <section>
        <DrawerHeader
          readingGroup={readingGroup}
          confirm={confirm}
          onArchive={onArchive}
        />
        <DuplicatePanel readingGroup={readingGroup} onProceed={doDuplicate} />
        <GroupSettingsForm
          mode="edit"
          group={readingGroup}
          onSuccess={closeDrawer}
        />
      </section>
    </Collapse>
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
