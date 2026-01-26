import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import Collapse from "global/components/Collapse";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import withConfirmation from "hoc/withConfirmation";
import { requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { DuplicatePanel } from "./panels";
import DrawerHeader from "./panels/parts/DrawerHeader";

const { request } = entityStoreActions;

function ReadingGroupSettings({ confirm }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { readingGroup, closeDrawer, onArchive } = useOutletContext() || {};

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
      } else if (closeDrawer) {
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
          onSuccess={closeDrawer || (() => {})}
        />
      </section>
    </Collapse>
  );
}

ReadingGroupSettings.displayName = "ReadingGroup.Settings";

ReadingGroupSettings.propTypes = {
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(ReadingGroupSettings);
