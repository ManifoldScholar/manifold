import React from "react";
import { useTranslation } from "react-i18next";
import TypeHeader from "../parts/TypeHeader";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import useDragMonitor from "./useDragMonitor";
import * as Styled from "./styles";

function CollectedTexts(props) {
  const { t } = useTranslation();

  const { hidden, active } = useDragMonitor("texts");

  return (
    <Styled.Type $active={active} $hidden={hidden}>
      <TypeHeader heading={`${t("glossary.text_title_case_other")}:`} />
      <SortableCollectables type="texts" {...props} />
    </Styled.Type>
  );
}

CollectedTexts.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Texts";

CollectedTexts.propTypes = collectedShape;

export default CollectedTexts;
