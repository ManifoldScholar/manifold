import { useSubmit, useOutletContext } from "react-router";
import readingGroupSettings from "app/routes/utility/actions/readingGroupSettings";
import ReadingGroupSettings from "frontend/components/reading-group/Settings";

export const handle = {
  drawer: true
};

export const action = readingGroupSettings;

export default function ReadingGroupMembersSettingsRoute({ actionData }) {
  const submit = useSubmit();
  const { readingGroup } = useOutletContext();

  return (
    <ReadingGroupSettings
      submit={(formData, options) => {
        // For update, add intent and groupId
        if (!formData.has("intent")) {
          formData.append("intent", "update");
          formData.append("groupId", readingGroup.id);
        }
        submit(formData, options);
      }}
      errors={actionData?.errors || []}
    />
  );
}
