import React from "react";
import TypeHeader from "../parts/TypeHeader";
import { useTranslation } from "react-i18next";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import useDragMonitor from "./useDragMonitor";
import * as Styled from "./styles";

function CollectedJournalIssues(props) {
  const { t } = useTranslation();

  const { hidden, active } = useDragMonitor("journalIssues");

  return (
    <Styled.Type $active={active} $hidden={hidden}>
      <TypeHeader heading={`${t("glossary.issue_title_case_other")}:`} />
      <SortableCollectables type="journalIssues" {...props} />
    </Styled.Type>
  );
}

CollectedJournalIssues.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Projects";

CollectedJournalIssues.propTypes = collectedShape;

export default CollectedJournalIssues;
