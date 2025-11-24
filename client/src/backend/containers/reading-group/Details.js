import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import GroupSummaryBox from "frontend/components/reading-group/headings/Group/GroupSummaryBox";
import FormSectionLabel from "global/components/form/SectionLabel";

export default function ReadingGroupDetailsContainer() {
  const { t } = useTranslation();
  const { readingGroup } = useOutletContext() || {};

  return (
    <Authorize
      entity={readingGroup}
      ability="read"
      failureNotification
      failureRedirect={lh.link("backendReadingGroups")}
    >
      <FormSectionLabel label={t("pages.subheaders.group_details")} />
      <GroupSummaryBox readingGroup={readingGroup} isBackend />
    </Authorize>
  );
}
