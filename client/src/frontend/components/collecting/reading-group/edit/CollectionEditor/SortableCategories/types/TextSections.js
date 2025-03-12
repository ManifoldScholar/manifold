import React from "react";
import { useTranslation } from "react-i18next";
import TypeHeader from "../parts/TypeHeader";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import useDragMonitor from "./useDragMonitor";
import * as Styled from "./styles";

function CollectedTextSections(props) {
  const { t } = useTranslation();

  const { hidden, active } = useDragMonitor("textSections");

  return (
    <Styled.Type $active={active} $hidden={hidden}>
      <TypeHeader heading={`${t("glossary.text_section_title_case_other")}:`} />
      <SortableCollectables type="textSections" {...props} />
    </Styled.Type>
  );
}

CollectedTextSections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.TextSections";

CollectedTextSections.propTypes = collectedShape;

export default CollectedTextSections;
