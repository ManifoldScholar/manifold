import React from "react";
import { TypeHeader } from "../parts";
import { useTranslation } from "react-i18next";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedJournalIssues({ showDropzone, ...restProps }) {
  const { t } = useTranslation();

  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={`${t("glossary.issue_title_case_other")}:`} />
      <SortableCollectables type="journalIssues" {...restProps} />
    </Styled.Type>
  );
}

CollectedJournalIssues.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Projects";

CollectedJournalIssues.propTypes = collectedShape;

export default CollectedJournalIssues;
