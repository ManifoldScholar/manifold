import React from "react";
import { useTranslation } from "react-i18next";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedResources({ showDropzone, ...restProps }) {
  const { t } = useTranslation();

  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={`${t("glossary.resource_title_case_other")}:`} />
      <SortableCollectables type="resources" {...restProps} />
    </Styled.Type>
  );
}

CollectedResources.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Resources";

CollectedResources.propTypes = collectedShape;

export default CollectedResources;
