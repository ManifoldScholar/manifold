import React from "react";
import { useTranslation } from "react-i18next";
import TypeHeader from "../parts/TypeHeader";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import useDragMonitor from "./useDragMonitor";
import * as Styled from "./styles";

function CollectedResources(props) {
  const { t } = useTranslation();

  const { hidden, active } = useDragMonitor("resources");

  return (
    <Styled.Type $active={active} $hidden={hidden}>
      <TypeHeader heading={`${t("glossary.resource_title_case_other")}:`} />
      <SortableCollectables type="resources" {...props} />
    </Styled.Type>
  );
}

CollectedResources.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Resources";

CollectedResources.propTypes = collectedShape;

export default CollectedResources;
