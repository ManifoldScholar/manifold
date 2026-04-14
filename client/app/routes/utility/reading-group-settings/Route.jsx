import { useSubmit, useOutletContext } from "react-router";
import ReadingGroupSettings from "components/frontend/reading-group/Settings";

export default function ReadingGroupSettingsRoute({ actionData }) {
  const submit = useSubmit();
  const readingGroup = useOutletContext();

  return (
    <ReadingGroupSettings
      submit={(json, options) => {
        const data = JSON.parse(json);
        if (!data.intent) {
          data.intent = "update";
          data.groupId = readingGroup?.id;
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
