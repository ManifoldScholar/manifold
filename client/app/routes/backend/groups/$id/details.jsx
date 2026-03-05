import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import GroupSummaryBox from "frontend/components/reading-group/headings/Group/GroupSummaryBox";
import FormSectionLabel from "global/components/form/SectionLabel";

export default function GroupDetails() {
  const { t } = useTranslation();
  const { readingGroup } = useOutletContext() || {};

  return (
    <>
      <FormSectionLabel label={t("pages.subheaders.group_details")} />
      <GroupSummaryBox readingGroup={readingGroup} isBackend />
    </>
  );
}
