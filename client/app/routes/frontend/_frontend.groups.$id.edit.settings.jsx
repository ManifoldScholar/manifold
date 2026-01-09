import { useSubmit, useOutletContext } from "react-router";
import readingGroupSettings from "app/routes/utility/actions/readingGroupSettings";
import ReadingGroupSettings from "frontend/components/reading-group/Settings";

export const handle = {
  drawer: true
};

export const action = readingGroupSettings;

export default function ReadingGroupHomepageEditSettingsRoute({ actionData }) {
  const submit = useSubmit();
  const { readingGroup } = useOutletContext();

  return (
    <ReadingGroupSettings
      submit={(json, options) => {
        const data = JSON.parse(json);
        if (!data.intent) {
          data.intent = "update";
          data.groupId = readingGroup.id;
        }
        submit(JSON.stringify(data), {
          ...options,
          encType: "application/json"
        });
      }}
      errors={actionData?.errors || []}
    />
  );
}
