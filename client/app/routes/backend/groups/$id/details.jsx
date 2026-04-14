import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import GroupSummaryBox from "components/frontend/reading-group/headings/Group/GroupSummaryBox";
import FormSectionLabel from "components/global/form/SectionLabel";

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
