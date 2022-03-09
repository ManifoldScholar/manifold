import React from "react";
import { useTranslation } from "react-i18next";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedResourceCollections({ showDropzone, ...restProps }) {
  const { t } = useTranslation();

  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader
        heading={`${t("glossary.resource_collection_title_case_other")}:`}
      />
      <SortableCollectables type="resourceCollections" {...restProps} />
    </Styled.Type>
  );
}

CollectedResourceCollections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.ResourceCollections";

CollectedResourceCollections.propTypes = collectedShape;

export default CollectedResourceCollections;
