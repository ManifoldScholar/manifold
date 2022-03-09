import React from "react";
import { useTranslation } from "react-i18next";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedTextSections({ showDropzone, ...restProps }) {
  const { t } = useTranslation();

  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={`${t("glossary.text_section_title_case_other")}:`} />
      <SortableCollectables type="textSections" {...restProps} />
    </Styled.Type>
  );
}

CollectedTextSections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.TextSections";

CollectedTextSections.propTypes = collectedShape;

export default CollectedTextSections;
