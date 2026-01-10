import PropTypes from "prop-types";
import { useOutletContext } from "react-router";
import Collapse from "global/components/Collapse";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import { DuplicatePanel } from "./panels";
import DrawerHeader from "./panels/parts/DrawerHeader";

function ReadingGroupSettings({ submit, errors = [] }) {
  const { readingGroup } = useOutletContext();

  function doDuplicate({ name, copyAnnotations, archive, openOnProceed }) {
    const {
      href: endpoint,
      meta: { method }
    } = readingGroup.links.clone;

    submit(
      JSON.stringify({
        intent: "duplicate",
        endpoint,
        method,
        name,
        copyAnnotations,
        archive,
        openOnProceed
      }),
      { method: "post", encType: "application/json" }
    );
  }

  return (
    <Collapse>
      <section>
        <DrawerHeader readingGroup={readingGroup} />
        <DuplicatePanel readingGroup={readingGroup} onProceed={doDuplicate} />
        <GroupSettingsForm
          mode="edit"
          group={readingGroup}
          submit={submit}
          errors={errors}
        />
      </section>
    </Collapse>
  );
}

ReadingGroupSettings.displayName = "ReadingGroup.Settings";

ReadingGroupSettings.propTypes = {
  submit: PropTypes.func.isRequired,
  errors: PropTypes.array
};

export default ReadingGroupSettings;
