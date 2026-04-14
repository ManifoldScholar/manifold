import React from "react";
import { useTranslation } from "react-i18next";
import TypeHeader from "../parts/TypeHeader";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import useDragMonitor from "./useDragMonitor";
import * as Styled from "./styles";

function CollectedResourceCollections(props) {
  const { t } = useTranslation();

  const { hidden, active } = useDragMonitor("resourceCollections");

  return (
    <Styled.Type $active={active} $hidden={hidden}>
      <TypeHeader
        heading={`${t("glossary.resource_collection_title_case_other")}:`}
      />
      <SortableCollectables type="resourceCollections" {...props} />
    </Styled.Type>
  );
}

CollectedResourceCollections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.ResourceCollections";

CollectedResourceCollections.propTypes = collectedShape;

export default CollectedResourceCollections;
